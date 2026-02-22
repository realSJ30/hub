"use client";

import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import { useDeletePayment } from "@/hooks";

interface DeletePaymentDialogProps {
  payment: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeletePaymentDialog = ({
  payment,
  open,
  onOpenChange,
  onSuccess,
}: DeletePaymentDialogProps) => {
  const { mutate: deletePayment, isPending } = useDeletePayment();

  const handleDelete = () => {
    if (!payment) return;

    deletePayment(payment.id, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleDelete}
      title="Delete Payment"
      description={
        <>
          This action cannot be undone. This will permanently delete the payment
          record of{" "}
          <strong>{payment ? formatCurrency(payment.amount) : ""}</strong>.
        </>
      }
      confirmValue={payment?.id || ""}
      isPending={isPending}
      placeholder="Type payment ID to confirm"
    />
  );
};
