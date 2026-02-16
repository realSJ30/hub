"use client";

import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import { useDeleteUnit } from "@/hooks";
import type { Unit } from "../columns";

interface DeleteUnitDialogProps {
  unit: Unit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteUnitDialog = ({
  unit,
  open,
  onOpenChange,
}: DeleteUnitDialogProps) => {
  const { mutate: deleteUnit, isPending } = useDeleteUnit();

  const handleDelete = () => {
    if (!unit) return;

    deleteUnit(unit.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleDelete}
      title="Delete Unit"
      description={
        <>
          This action cannot be undone. This will permanently delete the unit
          <strong> {unit?.name}</strong> and all associated data.
        </>
      }
      confirmValue={unit?.name || ""}
      isPending={isPending}
      placeholder="Type unit name to confirm"
    />
  );
};
