import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  recordPayment,
  getPaymentsForBooking,
  getAllPayments,
  deletePayment,
} from "@/actions/payment.actions";
import type { RecordPaymentInput } from "@/lib/validations/payment.schema";

export function usePaymentsForBooking(bookingId: string) {
  return useQuery({
    queryKey: ["payments", { bookingId }],
    queryFn: async () => {
      const result = await getPaymentsForBooking(bookingId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch payments");
      }
      return result;
    },
    enabled: !!bookingId,
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const result = await getAllPayments();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch payments");
      }
      return result;
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecordPaymentInput) => {
      const result = await recordPayment(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to record payment");
      }
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payments", { bookingId: variables.bookingId }],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePayment(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete payment");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
