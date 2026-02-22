"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, CreditCard, FileText, AlertCircle } from "lucide-react";
import {
  recordPaymentSchema,
  PAYMENT_METHODS,
} from "@/lib/validations/payment.schema";
import { useRecordPayment } from "@/hooks";

interface RecordPaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  bookingTotal: number;
  totalPaid: number;
}

export const RecordPaymentSheet = ({
  open,
  onOpenChange,
  bookingId,
  bookingTotal,
  totalPaid,
}: RecordPaymentSheetProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: recordPayment, isPending } = useRecordPayment();

  const remaining = bookingTotal - totalPaid;

  const form = useForm({
    defaultValues: {
      amount: remaining > 0 ? remaining : 0,
      method: "cash" as "cash" | "online_banking",
      referenceNumber: "",
      paidDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null);
      try {
        const validationResult = recordPaymentSchema.safeParse({
          bookingId,
          amount: Number(value.amount),
          method: value.method,
          referenceNumber: value.referenceNumber || undefined,
          paidDate: new Date(value.paidDate),
          notes: value.notes || undefined,
        });

        if (!validationResult.success) {
          const errors = validationResult.error.issues
            .map((i) => i.message)
            .join(", ");
          throw new Error(errors || "Invalid payment data");
        }

        recordPayment(validationResult.data, {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
          onError: (err: any) => {
            setErrorMessage(err.message || "Failed to record payment.");
          },
        });
      } catch (error: any) {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: remaining > 0 ? remaining : 0,
        method: "cash",
        referenceNumber: "",
        paidDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setErrorMessage(null);
    }
  }, [open, remaining, form]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          form.reset();
          setErrorMessage(null);
        }
      }}
    >
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Record Payment</SheetTitle>
          <SheetDescription>
            Attach a payment record to this booking. Partial payments are
            supported.
          </SheetDescription>
        </SheetHeader>

        {/* Payment summary banner */}
        <div className="mx-6 mt-4 mb-2 rounded-sm border border-neutral-100 bg-neutral-50 p-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500">Total Booking Amount</span>
            <span className="font-bold text-neutral-900">
              {formatCurrency(bookingTotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500">Total Paid</span>
            <span className="font-semibold text-emerald-600">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className="border-t border-neutral-200 pt-2 flex justify-between text-xs">
            <span className="font-bold text-neutral-700">
              Remaining Balance
            </span>
            <span
              className={`font-black ${remaining <= 0 ? (remaining < 0 ? "text-amber-600" : "text-emerald-600") : "text-amber-600"}`}
            >
              {formatCurrency(Math.abs(remaining))}{" "}
              {remaining < 0 && "(Overpaid)"}
            </span>
          </div>
        </div>

        {remaining < 0 && (
          <div className="mx-6 mt-2 mb-2 p-3 bg-amber-50 border border-amber-100 rounded-sm flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800 font-medium leading-tight">
              This booking is currently overpaid. The total amount collected
              exceeds the total booking cost by{" "}
              <span className="font-bold">
                {formatCurrency(Math.abs(remaining))}
              </span>
              .
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5 py-4 px-6"
        >
          {/* Amount */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <CreditCard size={16} className="text-neutral-400" />
              <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                Payment Details
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs font-semibold">
                Amount (₱)
              </Label>
              <form.Field
                name="amount"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || Number(value) <= 0)
                      return "Amount must be greater than 0";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="h-10 rounded-sm"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
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
              <Label htmlFor="method" className="text-xs font-semibold">
                Payment Method
              </Label>
              <form.Field name="method">
                {(field) => (
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as any)}
                  >
                    <SelectTrigger className="h-10 rounded-sm">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </form.Field>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidDate" className="text-xs font-semibold">
                Paid Date
              </Label>
              <form.Field name="paidDate">
                {(field) => (
                  <Input
                    id="paidDate"
                    type="date"
                    className="h-10 rounded-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="referenceNumber"
                className="text-xs font-semibold text-neutral-500"
              >
                Reference Number (Optional)
              </Label>
              <form.Field name="referenceNumber">
                {(field) => (
                  <Input
                    id="referenceNumber"
                    placeholder="e.g. GCASH-12345"
                    className="h-10 rounded-sm"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <FileText size={16} className="text-neutral-400" />
              <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                Notes
              </h3>
            </div>
            <form.Field name="notes">
              {(field) => (
                <Textarea
                  id="notes"
                  placeholder="Additional notes (optional)..."
                  className="rounded-sm resize-none text-sm"
                  rows={3}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-sm text-red-600 text-xs font-medium">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {errorMessage}
            </div>
          )}

          <SheetFooter className="gap-3 px-0 flex items-center flex-row-reverse pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Payment"
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
