"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Loader2, MapPin, User, Info, X, Tag } from "lucide-react";
import {
  createBookingSchema,
  baseBookingSchema,
  type CreateBookingInput,
} from "@/lib/validations/booking.schema";
import { createCustomerSchema } from "@/lib/validations/customer.schema";
import {
  useCreateBooking,
  useUnits,
  useUpsertCustomer,
  useUnitAvailability,
} from "@/hooks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type DateRange } from "react-day-picker";
import { BookingDateRangePicker } from "./booking-date-range-picker";
import {
  format,
  addDays,
  differenceInDays,
  setHours,
  setMinutes,
} from "date-fns";

// Helper for overlap validation
const checkOverlap = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  availabilityData: any[],
) => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) return null;

  const hasOverlap = availabilityData?.some((booking) => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    return start < bookingEnd && end > bookingStart;
  });

  return hasOverlap
    ? "Selected range overlaps with an existing booking."
    : null;
};

export const AddBookingSheet = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [startTimeSelected, setStartTimeSelected] = useState(false);
  const [endTimeSelected, setEndTimeSelected] = useState(false);

  const { mutate: createBooking, isPending: isBookingPending } =
    useCreateBooking();
  const { mutateAsync: upsertCustomer, isPending: isCustomerPending } =
    useUpsertCustomer();
  const { data: unitsResult } = useUnits();

  const isPending = isBookingPending || isCustomerPending;
  const units = Array.isArray(unitsResult?.data) ? unitsResult.data : [];

  const form = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      unitId: "",
      startDate: new Date() as Date | undefined,
      endDate: addDays(new Date(), 1) as Date | undefined,
      location: "",
      pricePerDay: 0,
      totalPrice: 0,
      status: "PENDING" as any,
      metadata: [] as string[], // Use array for form state
    },
    onSubmit: async ({ value }) => {
      console.log(value.startDate, value.endDate);
      try {
        setErrorMessage(null);

        const availabilityData = unitsResult?.data
          ? Array.isArray(unitsResult.data)
            ? unitsResult.data
            : [] // In case we need to fetch fresh availability, but for now we might rely on client state or separate check.
          : [];

        // However, availabilityData is specific to a unit. We can't access `availabilityData` from useUnitAvailability hook here directly because prompts are blocked.
        // We need to re-fetch or assume the user hasn't bypassed the client-side check.
        // For simplicity in this client-side first approach, we'll assume the client check inside form.Subscribe works visually.
        // BUT strict requirement says "The form's submit button still gets triggered. This should not happen."

        // To do this robustly in onSubmit without top-level state:
        // We can pass the `availabilityData` from the hook into the scope if we define it outside? No, hooks are inside component.
        // We can trust the validationError if we had access to it, but we removed it from top level.

        // BETTER: We can just let the onSubmit logic rely on a quick re-check if we have access to the data.
        // Since we can't easily access `availabilityData` derived from the hook inside this callback without refs or state,
        // and we removed the state to fix the infinite loop...

        // ALTERNATIVE: Use a ref to store the current validation error state, updated during render.
        // But that's hacky.

        // Let's use `form.store` to get the latest unitId, then we need the availability.
        // Actually, `useUnitAvailability` likely caches data.
        // We can't call hooks inside onSubmit.

        // Solution: Keep `availabilityData` at top level (it's fine, unitId changes rarely).
        // Pass a `validateBooking` flag or ref?

        // Simplest valid React pattern:
        // Use a ref to track the current validity based on the last render's check.
        if (validationErrorRef.current) {
          throw new Error(validationErrorRef.current);
        }

        // 1. Separate Customer Data
        const customerParseResult = createCustomerSchema.safeParse({
          fullName: value.customerName,
          phone: value.customerPhone,
          email: value.customerEmail,
        });

        if (!customerParseResult.success) {
          const errors = customerParseResult.error.issues
            .map((i) => i.message)
            .join(", ");
          throw new Error(errors || "Invalid customer data");
        }

        // 2. Upsert Customer first
        const customerResult = await upsertCustomer(customerParseResult.data);

        if (!customerResult.success || !customerResult.data) {
          throw new Error(
            customerResult.error || "Failed to handle customer information.",
          );
        }

        const customerId = customerResult.data.id;

        // 3. Create Booking with the returned customerId
        if (!value.startDate || !value.endDate) {
          throw new Error("Start and End dates are required.");
        }

        const start = new Date(value.startDate);
        const end = new Date(value.endDate);

        const bookingPayload = {
          customerId,
          unitId: value.unitId,
          startDate: start,
          endDate: end,
          pricePerDay: Number(value.pricePerDay),
          totalPrice: Number(value.totalPrice),
          status: value.status,
          location: value.location,
          metadata: value.metadata.join(", "), // Convert array to string
        };

        const validatedBookingResult =
          createBookingSchema.safeParse(bookingPayload);

        if (!validatedBookingResult.success) {
          const errors = validatedBookingResult.error.issues
            .map((i) => i.message)
            .join(", ");
          throw new Error(errors || "Invalid booking details");
        }

        createBooking(validatedBookingResult.data, {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            setErrorMessage(error.message || "Failed to create booking.");
          },
        });
      } catch (error: any) {
        if (
          error.message !== "Selected range overlaps with an existing booking."
        ) {
          console.error("Workflow error:", error);
        }
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    },
  });

  // Get current unitId from form to fetch availability
  const selectedUnitId = useStore(form.store, (state) => state.values.unitId);

  const {
    data: availabilityResult,
    isLoading: isLoadingAvailability,
    refetch: refreshAvailability,
  } = useUnitAvailability(selectedUnitId);

  const availabilityData = React.useMemo(() => {
    return availabilityResult?.success ? availabilityResult.data : [];
  }, [availabilityResult]);

  const validationErrorRef = React.useRef<string | null>(null);

  // We calculate validation error inside form.Subscribe to avoid top-level re-renders
  // but we need to signal to onSubmit to block.
  // We'll update the ref inside the render prop or effect?
  // Updating ref during render is okay if it doesn't trigger re-render.

  // Actually, we can just keep availabilityData at top level (that wasn't the issue).
  // The issue was `startDate` and `endDate` causing re-renders.

  // So:
  // 1. availabilityData is calculated at top level.
  // 2. form.Subscribe calculates error during render.
  // 3. We can update the ref there.

  // Calculate total price based on unit and dates
  const calculateDerivedTotal = (price: number, start: Date, end: Date) => {
    const days = Math.max(differenceInDays(end, start), 1);
    return price * days;
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      const currentTags = form.getFieldValue("metadata");
      if (tag && !currentTags.includes(tag)) {
        form.setFieldValue("metadata", [...currentTags, tag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getFieldValue("metadata");
    form.setFieldValue(
      "metadata",
      currentTags.filter((t: string) => t !== tagToRemove),
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          className="gap-2 h-9 rounded-sm bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Add New Booking
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Booking</SheetTitle>
          <SheetDescription>
            Register a new rental booking. Start by entering customer details,
            then select the unit and period.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 py-6 p-6"
        >
          {/* Customer Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <User size={18} className="text-neutral-400" />
              <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                Customer Information
              </h3>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <form.Field
                  name="customerName"
                  validators={{
                    onChange: ({ value }) => {
                      const result =
                        createCustomerSchema.shape.fullName.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.errors[0]?.message;
                    },
                    onBlur: ({ value }) => {
                      const result =
                        createCustomerSchema.shape.fullName.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.errors[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerName"
                        className="text-xs font-semibold"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="customerName"
                        placeholder="e.g. John Doe"
                        className="h-10 rounded-sm"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-red-600 font-medium">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="customerPhone"
                    className="text-xs font-semibold"
                  >
                    Phone Number
                  </Label>
                  <form.Field
                    name="customerPhone"
                    validators={{
                      onChange: ({ value }) => {
                        const result =
                          createCustomerSchema.shape.phone.safeParse(value);
                        return result.success
                          ? undefined
                          : result.error.errors[0]?.message;
                      },
                      onBlur: ({ value }) => {
                        const result =
                          createCustomerSchema.shape.phone.safeParse(value);
                        return result.success
                          ? undefined
                          : result.error.errors[0]?.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Input
                          id="customerPhone"
                          placeholder="+63 9xx..."
                          className="h-10 rounded-sm"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-red-600 font-medium">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="customerEmail"
                    className="text-xs font-semibold text-neutral-500"
                  >
                    Email (Optional)
                  </Label>
                  <form.Field
                    name="customerEmail"
                    validators={{
                      onChange: ({ value }) => {
                        const result =
                          createCustomerSchema.shape.email.safeParse(value);
                        return result.success
                          ? undefined
                          : result.error.errors[0]?.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="john@example.com"
                          className="h-10 rounded-sm"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-red-600 font-medium">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Info size={18} className="text-neutral-400" />
              <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                Booking Details
              </h3>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitId" className="text-xs font-semibold">
                  Select Unit
                </Label>
                <form.Field
                  name="unitId"
                  validators={{
                    onChange: ({ value }) => {
                      const result =
                        baseBookingSchema.shape.unitId.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.errors[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => {
                          field.handleChange(val);
                          const selectedUnit = units.find((u) => u.id === val);
                          if (selectedUnit) {
                            const price = Number(selectedUnit.pricePerDay);
                            field.handleChange(val);
                            form.setFieldValue("pricePerDay", price);
                            const start = form.getFieldValue("startDate");
                            const end = form.getFieldValue("endDate");
                            if (start && end) {
                              const total = calculateDerivedTotal(
                                price,
                                start,
                                end,
                              );
                              form.setFieldValue("totalPrice", total);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 rounded-sm">
                          <SelectValue placeholder="Select a vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name} ({unit.brand}) - ₱
                              {Number(unit.pricePerDay).toLocaleString()}/day
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-red-600 font-medium">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Booking Range</Label>
                <form.Subscribe
                  selector={(state) => [
                    state.values.startDate,
                    state.values.endDate,
                    state.values.pricePerDay,
                  ]}
                >
                  {([startDate, endDate, pricePerDay]) => {
                    const validationError = checkOverlap(
                      startDate as Date | undefined,
                      endDate as Date | undefined,
                      availabilityData || [],
                    );

                    // Update ref for onSubmit check
                    validationErrorRef.current = validationError;

                    return (
                      <div className="space-y-4">
                        <BookingDateRangePicker
                          startDate={startDate as Date | undefined}
                          endDate={endDate as Date | undefined}
                          pricePerDay={Number(pricePerDay)}
                          startTimeSelected={startTimeSelected}
                          endTimeSelected={endTimeSelected}
                          availabilityData={availabilityData}
                          isLoadingAvailability={isLoadingAvailability}
                          onRefreshAvailability={refreshAvailability}
                          disabled={!selectedUnitId}
                          validationError={validationError}
                          onStartTimeChange={(newDate) => {
                            form.setFieldValue("startDate", newDate);
                            setStartTimeSelected(true);
                          }}
                          onEndTimeChange={(newDate) => {
                            form.setFieldValue("endDate", newDate);
                            setEndTimeSelected(true);
                          }}
                          onRangeChange={(range: DateRange | undefined) => {
                            const currentStart =
                              form.getFieldValue("startDate");
                            const currentEnd = form.getFieldValue("endDate");

                            let newStart = range?.from;
                            let newEnd = range?.to;

                            if (newStart && currentStart) {
                              newStart = setHours(
                                setMinutes(newStart, currentStart.getMinutes()),
                                currentStart.getHours(),
                              );
                            }

                            if (newEnd && currentEnd) {
                              newEnd = setHours(
                                setMinutes(newEnd, currentEnd.getMinutes()),
                                currentEnd.getHours(),
                              );
                            }

                            form.setFieldValue("startDate", newStart);
                            form.setFieldValue("endDate", newEnd);

                            if (newStart && newEnd) {
                              const total = calculateDerivedTotal(
                                Number(pricePerDay),
                                newStart,
                                newEnd,
                              );
                              form.setFieldValue("totalPrice", total);
                            }
                          }}
                        />
                      </div>
                    );
                  }}
                </form.Subscribe>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="pricePerDay"
                    className="text-xs font-semibold"
                  >
                    Price/Day
                  </Label>
                  <form.Field name="pricePerDay">
                    {(field) => (
                      <Input
                        id="pricePerDay"
                        type="number"
                        className="h-10 rounded-sm"
                        value={field.state.value}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          field.handleChange(val);
                          const start = form.getFieldValue("startDate");
                          const end = form.getFieldValue("endDate");
                          if (start && end) {
                            const total = calculateDerivedTotal(
                              val,
                              start,
                              end,
                            );
                            form.setFieldValue("totalPrice", total);
                          }
                        }}
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPrice" className="text-xs font-semibold">
                    Total Price
                  </Label>
                  <form.Field name="totalPrice">
                    {(field) => (
                      <Input
                        id="totalPrice"
                        type="number"
                        className="h-10 rounded-sm"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                    )}
                  </form.Field>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-semibold">
                  Rental Location
                </Label>
                <form.Field name="location">
                  {(field) => (
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-3 text-neutral-400"
                      />
                      <Input
                        id="location"
                        placeholder="e.g. Manila, Philippines"
                        className="h-10 rounded-sm pl-10"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Status</Label>
                <form.Field name="status">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val)}
                    >
                      <SelectTrigger className="h-10 rounded-sm">
                        <SelectValue placeholder="Booking Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Metadata Tags</Label>
                <div className="space-y-3">
                  <Input
                    placeholder="Press enter to add tag..."
                    className="h-10 rounded-sm"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <form.Field name="metadata">
                    {(field) => (
                      <div className="flex flex-wrap gap-2">
                        {field.state.value.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="pl-2 pr-1 py-1 gap-1 rounded-sm border-neutral-200"
                          >
                            <Tag size={10} className="text-neutral-500" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:bg-neutral-200 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                        {field.state.value.length === 0 && (
                          <span className="text-[10px] text-neutral-400 italic">
                            No tags added
                          </span>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-sm text-red-600 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <SheetFooter className="gap-4 px-0 flex item-center flex-row-reverse">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
