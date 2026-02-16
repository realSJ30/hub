import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getBookings,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
