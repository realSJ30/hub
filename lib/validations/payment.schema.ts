import { z } from "zod";

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "online_banking", label: "Online Banking" },
] as const;

export const paymentMethodEnum = z.enum(["cash", "online_banking"], {
  required_error: "Payment method is required",
});

export const recordPaymentSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  amount: z
    .number({ required_error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  method: paymentMethodEnum,
  referenceNumber: z.string().optional().or(z.literal("")),
  paidDate: z.date({ required_error: "Paid date is required" }),
  notes: z.string().optional().or(z.literal("")),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
