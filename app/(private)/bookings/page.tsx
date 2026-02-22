"use client";

import { BookingsTableHeader } from "./components/bookings-table-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import { useBookings, useUpdateBookingStatus } from "@/hooks";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddBookingSheet } from "./components/add-booking-sheet";
import { DeleteBookingDialog } from "./components/delete-booking-dialog";
import { RecordPaymentSheet } from "./components/record-payment-sheet";
import { useState } from "react";
import { type Booking } from "./columns";

const BookingsPage = () => {
  const { data: bookingsResult, isLoading, isError, error } = useBookings();
  const { mutate: updateStatus } = useUpdateBookingStatus();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(
    undefined,
  );
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [bookingForPayment, setBookingForPayment] = useState<Booking | null>(
    null,
  );

  const handleAdd = () => {
    setSelectedBooking(undefined);
    setIsSheetOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };

  const handleDelete = (booking: Booking) => {
    setBookingToDelete(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  const handleRecordPayment = (booking: Booking) => {
    setBookingForPayment(booking);
    setIsPaymentSheetOpen(true);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <BookingsTableHeader onAdd={handleAdd} />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm mt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-500 font-medium animate-pulse">
                Loading bookings...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load bookings. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && (
        <div className="mt-6">
          <DataTable
            columns={columns}
            data={bookingsResult?.data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
            onRecordPayment={handleRecordPayment}
          />
        </div>
      )}

      <AddBookingSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        booking={selectedBooking}
      />

      <DeleteBookingDialog
        booking={bookingToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <RecordPaymentSheet
        open={isPaymentSheetOpen}
        onOpenChange={setIsPaymentSheetOpen}
        bookingId={bookingForPayment?.id || ""}
        bookingTotal={bookingForPayment?.totalPrice || 0}
        totalPaid={0}
      />
    </div>
  );
};

export default BookingsPage;
