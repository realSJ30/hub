import { z } from "zod";

export const unitStatusEnum = z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"], {
  required_error: "Status is required",
});

export const createUnitSchema = z.object({
  name: z
    .string()
    .min(1, "Unit name is required")
    .min(3, "Unit name must be at least 3 characters")
    .max(100, "Unit name must not exceed 100 characters"),
  
  brand: z
    .string()
    .min(1, "Brand is required")
    .min(2, "Brand must be at least 2 characters")
    .max(50, "Brand must not exceed 50 characters"),
  
  year: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .int("Year must be a whole number")
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be too far in the future"),
  
  plate: z
    .string()
    .min(1, "Plate number is required")
    .regex(/^[A-Z0-9-]+$/, "Plate must contain only uppercase letters, numbers, and hyphens")
    .min(3, "Plate must be at least 3 characters")
    .max(20, "Plate must not exceed 20 characters"),
  
  transmission: z
    .string()
    .min(1, "Transmission type is required"),
  
  capacity: z
    .number({
      required_error: "Capacity is required",
      invalid_type_error: "Capacity must be a number",
    })
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(100, "Capacity must not exceed 100"),
  
  pricePerDay: z
    .number({
      required_error: "Price per day is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0")
    .max(1000000, "Price must not exceed 1,000,000"),
  
  status: unitStatusEnum,
  
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;

export interface UnitFilters {
  status?: string;
  name?: string;
  brand?: string;
  plate?: string;
  transmission?: string;
  yearMin?: number;
  yearMax?: number;
  capacityMin?: number;
  capacityMax?: number;
  priceMin?: number;
  priceMax?: number;
}

