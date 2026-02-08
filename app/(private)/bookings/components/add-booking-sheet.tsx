"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
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
import {
  Plus,
  Loader2,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Info,
} from "lucide-react";
import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/lib/validations/booking.schema";
import { createCustomerSchema } from "@/lib/validations/customer.schema";
import { useCreateBooking, useUnits, useUpsertCustomer } from "@/hooks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const AddBookingSheet = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 86400000), // Next day
      location: "",
      pricePerDay: 0,
      totalPrice: 0,
      status: "PENDING" as any,
      metadata: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorMessage(null);

        // 1. Separate Customer Data
        const customerData = createCustomerSchema.parse({
          fullName: value.customerName,
          phone: value.customerPhone,
          email: value.customerEmail,
        });

        // 2. Upsert Customer first
        const customerResult = await upsertCustomer(customerData);

        if (!customerResult.success || !customerResult.data) {
          throw new Error(
            customerResult.error || "Failed to handle customer information.",
          );
        }

        const customerId = customerResult.data.id;

        // 3. Create Booking with the returned customerId
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
          metadata: value.metadata,
        };

        const validatedBooking = createBookingSchema.parse(bookingPayload);

        createBooking(validatedBooking, {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            setErrorMessage(error.message || "Failed to create booking.");
          },
        });
      } catch (error: any) {
        console.error("Workflow error:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    },
  });

  // Calculate total price when pricePerDay or dates change
  const updateTotalPrice = (price: number, start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    form.setFieldValue("totalPrice", price * diffDays);
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
                <Label htmlFor="customerName" className="text-xs font-semibold">
                  Full Name
                </Label>
                <form.Field name="customerName">
                  {(field) => (
                    <Input
                      id="customerName"
                      placeholder="e.g. John Doe"
                      className="h-10 rounded-sm"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
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
                  <form.Field name="customerPhone">
                    {(field) => (
                      <Input
                        id="customerPhone"
                        placeholder="+63 9xx..."
                        className="h-10 rounded-sm"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
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
                  <form.Field name="customerEmail">
                    {(field) => (
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="john@example.com"
                        className="h-10 rounded-sm"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
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
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        field.handleChange(val);
                        const selectedUnit = units.find((u) => u.id === val);
                        if (selectedUnit) {
                          const price = Number(selectedUnit.pricePerDay);
                          form.setFieldValue("pricePerDay", price);
                          updateTotalPrice(
                            price,
                            new Date(form.state.values.startDate),
                            new Date(form.state.values.endDate),
                          );
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
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs font-semibold">
                    Start Date
                  </Label>
                  <form.Field name="startDate">
                    {(field) => (
                      <Input
                        id="startDate"
                        type="datetime-local"
                        className="h-10 rounded-sm"
                        value={format(
                          new Date(field.state.value),
                          "yyyy-MM-dd'T'HH:mm",
                        )}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.handleChange(date);
                          updateTotalPrice(
                            form.state.values.pricePerDay,
                            date,
                            new Date(form.state.values.endDate),
                          );
                        }}
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs font-semibold">
                    End Date
                  </Label>
                  <form.Field name="endDate">
                    {(field) => (
                      <Input
                        id="endDate"
                        type="datetime-local"
                        className="h-10 rounded-sm"
                        value={format(
                          new Date(field.state.value),
                          "yyyy-MM-dd'T'HH:mm",
                        )}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.handleChange(date);
                          updateTotalPrice(
                            form.state.values.pricePerDay,
                            new Date(form.state.values.startDate),
                            date,
                          );
                        }}
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

              <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </form.Field>
                </div>
                <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-100 flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Total Quote
                  </span>
                  <form.Field name="totalPrice">
                    {(field) => (
                      <span className="text-xl font-bold text-neutral-900">
                        ₱{field.state.value.toLocaleString()}
                      </span>
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
