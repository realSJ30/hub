import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertCustomer, getCustomers } from "@/actions/customer.actions";
import type { CreateCustomerInput } from "@/lib/validations/customer.schema";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const result = await getCustomers();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch customers");
      }
      return result;
    },
  });
}

export function useUpsertCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerInput) => {
      const result = await upsertCustomer(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to handle customer");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
