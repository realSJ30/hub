import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit, updateUnit, deleteUnit, uploadUnitImage } from "@/actions/unit.actions";
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["unit", variables.id] });
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

/**
 * Custom hook for uploading a unit image to Supabase Storage
 *
 * Wraps the `uploadUnitImage` server action. The caller provides a
 * plain `File`; the hook converts it into a `FormData` before calling
 * the action (File objects cannot be serialised across the
 * server/client boundary).
 *
 * @example
 * const { mutateAsync: uploadImage, isPending } = useUploadUnitImage();
 * const { publicUrl } = await uploadImage(file);
 */
export function useUploadUnitImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadUnitImage(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload image");
      }

      return result.data!; // { publicUrl: string }
    },
    onError: (error) => {
      console.error("Error in useUploadUnitImage:", error);
    },
  });
}
