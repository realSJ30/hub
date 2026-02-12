import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit, updateUnit, deleteUnit } from "@/actions/unit.actions";
import type { CreateUnitInput } from "@/lib/validations/unit.schema";

/**
 * Custom hook for creating a new unit
 */
export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUnitInput) => {
      const result = await createUnit(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to create unit");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
    onError: (error) => {
      console.error("Error in useCreateUnit:", error);
    },
  });
}

/**
 * Custom hook for updating an existing unit
 */
export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateUnitInput }) => {
      const result = await updateUnit(id, data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update unit");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
    onError: (error) => {
      console.error("Error in useUpdateUnit:", error);
    },
  });
}

/**
 * Custom hook for deleting a unit
 */
export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteUnit(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete unit");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
    onError: (error) => {
      console.error("Error in useDeleteUnit:", error);
    },
  });
}
