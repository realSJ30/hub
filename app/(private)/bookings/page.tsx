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
import { ActionConfirmationDialog } from "@/components/custom/action-confirmation-dialog";
import { MonthlyCalendar } from "./components/monthly-calendar";
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
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState<Booking | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

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
    if (status === "COMPLETED") {
      const booking = bookingsResult?.data?.find((b: Booking) => b.id === id);
      if (booking) {
        const totalPaid = booking.totalPaid || 0;
        const isFullyPaid = totalPaid >= booking.totalPrice;

        if (isFullyPaid) {
          updateStatus({ id, status });
        } else {
          setBookingToComplete(booking);
          setIsStatusConfirmOpen(true);
        }
        return;
      }
    }
    updateStatus({ id, status });
  };

  const handleRecordPayment = (booking: Booking) => {
    setBookingForPayment(booking);
    setIsPaymentSheetOpen(true);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-64px)]">
      <BookingsTableHeader
        onAdd={handleAdd}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

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

      {/* Data View */}
      {!isLoading && !isError && (
        <div className="mt-6 flex-1 min-h-0 flex flex-col">
          {viewMode === "list" ? (
            <DataTable
              columns={columns}
              data={bookingsResult?.data || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              onRecordPayment={handleRecordPayment}
            />
          ) : (
            <div className="flex-1 bg-white border border-neutral-200 shadow-sm rounded-sm flex flex-col overflow-hidden">
              <MonthlyCalendar bookings={bookingsResult?.data || []} />
            </div>
          )}
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
        totalPaid={bookingForPayment?.totalPaid || 0}
      />

      <ActionConfirmationDialog
        open={isStatusConfirmOpen}
        onOpenChange={setIsStatusConfirmOpen}
        onConfirm={() => {
          if (bookingToComplete) {
            updateStatus({ id: bookingToComplete.id, status: "COMPLETED" });
          }
          setIsStatusConfirmOpen(false);
        }}
        title="Payment Incomplete"
        description={
          <div className="space-y-4">
            <p>
              This booking is not yet fully paid. There is a remaining balance
              of{" "}
              <span className="font-black text-amber-600">
                ₱
                {Math.abs(
                  (bookingToComplete?.totalPrice || 0) -
                    (bookingToComplete?.totalPaid || 0),
                ).toLocaleString()}
              </span>
              .
            </p>
            <p className="text-xs text-neutral-400">
              Marking this booking as completed will close the active rental
              period despite the pending balance. Are you sure you want to
              proceed?
            </p>
          </div>
        }
        confirmButtonText="Yes, Mark as Completed"
        cancelButtonText="No, Keep Active"
        variant="warning"
      />
    </div>
  );
};

export default BookingsPage;
