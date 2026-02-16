"use client";

import * as React from "react";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import { useDeleteBooking } from "@/hooks";
import type { Booking } from "../columns";

interface DeleteBookingDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteBookingDialog = ({
  booking,
  open,
  onOpenChange,
}: DeleteBookingDialogProps) => {
  const { mutate: deleteBooking, isPending } = useDeleteBooking();

  const handleDelete = () => {
    if (!booking) return;

    deleteBooking(booking.id, {
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
      title="Delete Booking"
      description={
        <>
          This action cannot be undone. This will permanently delete the booking
          for <strong>{booking?.unitName}</strong> ({booking?.customerName}) and
          all associated records.
        </>
      }
      confirmValue={booking?.id || ""}
      isPending={isPending}
      placeholder="Type booking ID to confirm"
    />
  );
};
