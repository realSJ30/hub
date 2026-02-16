import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getBookings,
  getBookingsByUnit,
  getBooking,
  updateBooking,
  deleteBooking,
} from "@/actions/booking.actions";
import type { CreateBookingInput } from "@/lib/validations/booking.schema";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const result = await getBookings();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch bookings");
      }
      return result;
    },
  });
}

export function useBookingsByUnit(unitId: string) {
  return useQuery({
    queryKey: ["bookings", { unitId }],
    queryFn: async () => {
      const result = await getBookingsByUnit(unitId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch unit bookings");
      }
      return result;
    },
    enabled: !!unitId,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const result = await getBooking(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch booking");
      }
      return result;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      const result = await createBooking(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to create booking");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateBookingInput }) => {
      const result = await updateBooking(id, data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update booking");
      }
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteBooking(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete booking");
      }
      return result;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
}
