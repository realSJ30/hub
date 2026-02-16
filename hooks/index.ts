/**
 * Custom Hooks Index
 * 
 * This file exports all custom hooks for easy importing throughout the application.
 * 
 * @example
 * import { useCreateUnit, useUnits } from "@/hooks";
 */

export { useCreateUnit, useUpdateUnit, useDeleteUnit } from "./use-create-unit";
export { useUnits, useUnit } from "./use-units";
export { useBookings, useBookingsByUnit, useBooking, useCreateBooking, useUpdateBooking, useDeleteBooking } from "./use-bookings";
export { useCustomers, useUpsertCustomer } from "./use-customers";
export { useUnitAvailability } from "./use-unit-availability";
