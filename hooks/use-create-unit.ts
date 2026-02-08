import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit } from "@/app/actions/unit.actions";
import type { CreateUnitInput } from "@/lib/validations/unit.schema";

/**
 * Custom hook for creating a new unit
 * 
 * This hook abstracts the mutation logic for creating a unit using TanStack Query.
 * It handles loading, success, and error states, and automatically invalidates
 * related queries after successful creation.
 * 
 * @returns TanStack Query mutation object with:
 *   - mutate/mutateAsync: Function to trigger the mutation
 *   - isPending: Loading state
 *   - isSuccess: Success state
 *   - isError: Error state
 *   - error: Error object if mutation failed
 *   - data: Response data from the server action
 * 
 * @example
 * ```tsx
 * const { mutate, isPending, isError, error } = useCreateUnit();
 * 
 * const handleSubmit = (data: CreateUnitInput) => {
 *   mutate(data, {
 *     onSuccess: () => {
 *       console.log("Unit created successfully!");
 *     },
 *     onError: (error) => {
 *       console.error("Failed to create unit:", error);
 *     },
 *   });
 * };
 * ```
 */
export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUnitInput) => {
      const result = await createUnit(data);
      
      // If the server action returns an error, throw it so TanStack Query treats it as a failure
      if (!result.success) {
        throw new Error(result.error || "Failed to create unit");
      }
      
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch units queries after successful creation
      // This ensures the units list is updated with the new unit
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
    onError: (error) => {
      // Log error for debugging
      console.error("Error in useCreateUnit:", error);
    },
  });
}
