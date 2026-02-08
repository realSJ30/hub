import { z } from "zod";

export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(7, "Phone number is too short"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export interface CustomerFilters {
  fullName?: string;
  email?: string;
  phone?: string;
}
