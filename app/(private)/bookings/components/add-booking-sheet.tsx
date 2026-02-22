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
} from "@/components/ui/sheet";
import {
  Loader2,
  MapPin,
  User,
  Info,
  X,
  Tag,
  AlertTriangle,
} from "lucide-react";
import {
  createBookingSchema,
} from "@/lib/validations/booking.schema";
import { createCustomerSchema } from "@/lib/validations/customer.schema";
import {
  useCreateBooking,
  useUpdateBooking,
  useUnits,
  useUpsertCustomer,
  useUnitAvailability,
} from "@/hooks";
import { type Booking } from "../columns";
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
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/utils/constants/booking";

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

const calculateDerivedTotal = (price: number, start: Date, end: Date) => {
  const days = Math.max(differenceInDays(end, start), 1);
  return price * days;
};

interface AddBookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking;
  defaultUnitId?: string;
}

export const AddBookingSheet = ({
  open,
  onOpenChange,
  booking,
  defaultUnitId,
}: AddBookingSheetProps) => {
  const isEdit = !!booking;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [startTimeSelected, setStartTimeSelected] = useState(isEdit);
  const [endTimeSelected, setEndTimeSelected] = useState(isEdit);

  const { mutate: createBooking, isPending: isCreatingBooking } =
    useCreateBooking();
  const { mutate: updateBooking, isPending: isUpdatingBooking } =
    useUpdateBooking();
  const { mutateAsync: upsertCustomer, isPending: isCustomerPending } =
    useUpsertCustomer();
  const { data: unitsResult } = useUnits();

  const isPending = isCreatingBooking || isUpdatingBooking || isCustomerPending;
  const units = Array.isArray(unitsResult?.data) ? unitsResult.data : [];

  // Determine initial derived values
  const initialUnitId = booking?.unitId || defaultUnitId || "";
  const initialUnit = units.find((u) => u.id === initialUnitId);
  const initialPrice =
    booking?.pricePerDay || (initialUnit ? Number(initialUnit.pricePerDay) : 0);
  const initialStart = booking ? new Date(booking.startDate) : new Date();
  const initialEnd = booking
    ? new Date(booking.endDate)
    : addDays(new Date(), 1);
  const initialTotal =
    booking?.totalPrice ||
    calculateDerivedTotal(initialPrice, initialStart, initialEnd);

  const form = useForm({
    defaultValues: {
      customerName: booking?.customerName || "",
      customerPhone: booking?.customerPhone || "",
      customerEmail: booking?.customerEmail || "",
      unitId: initialUnitId,
      startDate: initialStart as Date | undefined,
      endDate: initialEnd as Date | undefined,
      location: booking?.location || "",
      pricePerDay: initialPrice,
      totalPrice: initialTotal,
      status: (booking?.status as any) || "PENDING",
      metadata: booking?.metadata
        ? booking.metadata.split(", ").filter(Boolean)
        : [],
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorMessage(null);

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

        if (isEdit && booking) {
          updateBooking(
            { id: booking.id, data: validatedBookingResult.data },
            {
              onSuccess: () => {
                onOpenChange(false);
              },
              onError: (error: any) => {
                setErrorMessage(error.message || "Failed to update booking.");
              },
            },
          );
        } else {
          createBooking(validatedBookingResult.data, {
            onSuccess: () => {
              onOpenChange(false);
            },
            onError: (error: any) => {
              setErrorMessage(error.message || "Failed to create booking.");
            },
          });
        }
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

  // Reset form when booking or open state changes
  React.useEffect(() => {
    if (open) {
      form.reset();
      setStartTimeSelected(!!booking);
      setEndTimeSelected(!!booking);
      setErrorMessage(null);
      setTagInput("");
    }
  }, [booking, open, form]);

  const selectedUnitId = useStore(form.store, (state) => state.values.unitId);

  const {
    data: availabilityResult,
    isLoading: isLoadingAvailability,
    refetch: refreshAvailability,
  } = useUnitAvailability(selectedUnitId);

  const availabilityData = React.useMemo(() => {
    const data =
      availabilityResult?.success && availabilityResult.data
        ? availabilityResult.data
        : [];
    if (isEdit && booking) {
      return data.filter((b: any) => b.id !== booking.id);
    }
    return data;
  }, [availabilityResult, isEdit, booking]);

  const validationErrorRef = React.useRef<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      const currentTags = form.getFieldValue("metadata") as string[];
      if (tag && !currentTags.includes(tag)) {
        form.setFieldValue("metadata", [...currentTags, tag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getFieldValue("metadata") as string[];
    form.setFieldValue(
      "metadata",
      currentTags.filter((t: string) => t !== tagToRemove),
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Booking" : "Add New Booking"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the rental booking details below."
              : "Register a new rental booking. Start by entering customer details, then select the unit and period."}
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
                <form.Field name="unitId">
                  {(field) => (
                    <div className="space-y-2">
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => {
                          field.handleChange(val);
                          const selectedUnit = units.find((u) => u.id === val);
                          if (selectedUnit) {
                            const price = Number(selectedUnit.pricePerDay);
                            form.setFieldValue("pricePerDay", price);
                            const start = form.getFieldValue("startDate") as
                              | Date
                              | undefined;
                            const end = form.getFieldValue("endDate") as
                              | Date
                              | undefined;
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
                    validationErrorRef.current = validationError;

                    return (
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
                          const currentStart = form.getFieldValue(
                            "startDate",
                          ) as Date | undefined;
                          const currentEnd = form.getFieldValue("endDate") as
                            | Date
                            | undefined;

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
                          const start = form.getFieldValue("startDate") as
                            | Date
                            | undefined;
                          const end = form.getFieldValue("endDate") as
                            | Date
                            | undefined;
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
                    {({ state, handleChange }) => (
                      <Input
                        id="totalPrice"
                        type="number"
                        className="h-10 rounded-sm"
                        value={state.value}
                        onChange={(e) => handleChange(Number(e.target.value))}
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
                    <div className="space-y-2">
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
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="NO_SHOW">No Show</SelectItem>
                        </SelectContent>
                      </Select>

                      <form.Subscribe
                        selector={(state) => [
                          state.values.status,
                          state.values.totalPrice,
                        ]}
                      >
                        {([status, totalPrice]) => {
                          const totalPaidAmount = booking?.totalPaid || 0;
                          const isUnpaidCompletion =
                            status === "COMPLETED" &&
                            totalPaidAmount < (totalPrice as number);

                          if (!isUnpaidCompletion) return null;

                          return (
                            <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-100 rounded-sm animate-in fade-in slide-in-from-top-1 duration-300">
                              <AlertTriangle
                                size={14}
                                className="text-amber-600 shrink-0 mt-0.5"
                              />
                              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-tight leading-tight">
                                Warning: Booking is not fully paid (₱
                                {(
                                  (totalPrice as number) - totalPaidAmount
                                ).toLocaleString()}{" "}
                                remaining)
                              </p>
                            </div>
                          );
                        }}
                      </form.Subscribe>
                    </div>
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
                        {(field.state.value as string[]).map((tag) => (
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
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Confirm Booking"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
