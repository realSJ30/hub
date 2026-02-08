import { z } from "zod";

export const bookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
  "IN_PROGRESS",
], {
  required_error: "Booking status is required",
});

export const createBookingSchema = z.object({
  customerId: z.string().uuid("Invalid customer selected"),
  unitId: z.string().uuid("Invalid unit selected"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  location: z.string().optional().or(z.literal("")),
  pricePerDay: z.number().positive("Price must be greater than 0"),
  totalPrice: z.number().positive("Total price must be greater than 0"),
  status: bookingStatusEnum.default("PENDING"),
  metadata: z.string().optional().or(z.literal("")),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
