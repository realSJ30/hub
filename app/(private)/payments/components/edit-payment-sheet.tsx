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
  updatePaymentSchema,
  PAYMENT_METHODS,
} from "@/lib/validations/payment.schema";
import { useUpdatePayment } from "@/hooks";

interface EditPaymentSheetProps {
  payment: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPaymentSheet = ({
  payment,
  open,
  onOpenChange,
}: EditPaymentSheetProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: updatePayment, isPending } = useUpdatePayment();

  const form = useForm({
    defaultValues: {
      amount: payment?.amount || 0,
      method: (payment?.method as "cash" | "online_banking") || "cash",
      referenceNumber: payment?.referenceNumber || "",
      paidDate: payment?.paidDate
        ? new Date(payment.paidDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      notes: payment?.notes || "",
    },
    onSubmit: async ({ value }) => {
      if (!payment) return;

      setErrorMessage(null);
      try {
        const validationResult = updatePaymentSchema.safeParse({
          id: payment.id,
          bookingId: payment.bookingId,
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

        updatePayment(validationResult.data, {
          onSuccess: () => {
            onOpenChange(false);
          },
          onError: (err: any) => {
            setErrorMessage(err.message || "Failed to update payment.");
          },
        });
      } catch (error: any) {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    },
  });

  // Reset form when payment changes or when opened
  useEffect(() => {
    if (open && payment) {
      form.reset({
        amount: payment.amount,
        method: payment.method as "cash" | "online_banking",
        referenceNumber: payment.referenceNumber || "",
        paidDate: new Date(payment.paidDate).toISOString().split("T")[0],
        notes: payment.notes || "",
      });
      setErrorMessage(null);
    }
  }, [open, payment, form]);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setErrorMessage(null);
        }
      }}
    >
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Payment</SheetTitle>
          <SheetDescription>Modify this payment record.</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5 py-4 px-6 mt-4"
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
                  Saving...
                </>
              ) : (
                "Save Changes"
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
