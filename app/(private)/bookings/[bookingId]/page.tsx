"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useBooking,
  useUpdateBookingStatus,
  usePaymentsForBooking,
} from "@/hooks";
import {
  Loader2,
  ChevronLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Tag,
  Edit,
  Trash2,
  Car,
  Info,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/utils/constants/booking";
import { AddBookingSheet } from "../components/add-booking-sheet";
import { DeleteBookingDialog } from "../components/delete-booking-dialog";
import { RecordPaymentSheet } from "../components/record-payment-sheet";
import { useState } from "react";
import { type Booking } from "../columns";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  online_banking: "Online Banking",
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote size={14} />,
  online_banking: <Smartphone size={14} />,
};

function derivePaymentStatus(totalPrice: number, totalPaid: number) {
  if (totalPaid <= 0)
    return { label: "Unpaid", styles: "bg-red-50 text-red-700 border-red-200" };
  if (totalPaid > totalPrice)
    return {
      label: "Overpaid",
      styles: "bg-amber-50 text-amber-700 border-amber-200",
    };
  if (totalPaid === totalPrice)
    return {
      label: "Paid",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  return {
    label: "Partially Paid",
    styles: "bg-amber-50 text-amber-700 border-amber-200",
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data: result, isLoading, isError, error } = useBooking(bookingId);
  const { data: paymentsResult, isLoading: isLoadingPayments } =
    usePaymentsForBooking(bookingId);
  const booking = result?.data;
  const payments = paymentsResult?.data || [];

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateBookingStatus();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-400 mb-4" />
        <p className="text-neutral-500 font-medium">
          Loading booking details...
        </p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2 text-neutral-500 hover:text-neutral-900"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        <div className="bg-red-50 border border-red-100 p-6 rounded-sm text-center">
          <Info className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-red-700 mb-6">
            {error instanceof Error
              ? error.message
              : "The requested booking could not be found."}
          </p>
          <Button onClick={() => router.push("/bookings")}>
            Return to Bookings List
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const now = new Date();

  // Progress calculation
  let progress = 0;
  if (now > startDate) {
    if (now > endDate) {
      progress = 100;
    } else {
      const total = endDate.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      progress = (elapsed / total) * 100;
    }
  }

  const duration = Math.max(differenceInDays(endDate, startDate), 1);
  const isCompleted = booking.status === "COMPLETED";
  const statusLabel = BOOKING_STATUS_LABELS[booking.status] || booking.status;
  const statusStyles =
    BOOKING_STATUS_STYLES[booking.status] || "bg-neutral-100 text-neutral-700";

  // Payment summary
  const totalPaid = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
  const remaining = booking.totalPrice - totalPaid;
  const paymentStatus = derivePaymentStatus(booking.totalPrice, totalPaid);

  return (
    <div className="p-8 max-w-[1200px] mx-auto pb-24">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit mb-2 -ml-2 text-neutral-500 hover:text-neutral-900 h-8"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Bookings
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Booking Details
            </h1>
            <Badge
              className={cn(
                "px-3 py-1 text-[11px] font-bold uppercase",
                statusStyles,
              )}
            >
              {statusLabel}
            </Badge>
          </div>
          <p className="text-neutral-500 text-sm">ID: {booking.id}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="gap-2 h-10 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-bold"
            onClick={() => setIsPaymentSheetOpen(true)}
          >
            <CreditCard size={16} />
            Record Payment
          </Button>
          <Button
            className="gap-2 h-10 rounded-sm bg-primary hover:bg-primary/80 text-white font-bold"
            disabled={isCompleted || isUpdatingStatus}
            onClick={() => updateStatus({ id: bookingId, status: "COMPLETED" })}
          >
            {isUpdatingStatus ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            {isCompleted ? "Completed" : "Mark as Completed"}
          </Button>
          <Button
            variant="outline"
            className="gap-2 h-10 rounded-sm border-neutral-200"
            onClick={() => setIsEditSheetOpen(true)}
          >
            <Edit size={16} />
            Edit Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Booking & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          {/* Schedule Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <Calendar size={18} className="text-neutral-900" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                Rental Schedule
              </h2>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 w-full">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Pick Up
                  </span>
                  <div className="bg-neutral-50 p-3 rounded-sm mb-2">
                    <Calendar size={24} className="text-neutral-900" />
                  </div>
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {format(startDate, "MMMM dd, yyyy")}
                  </span>
                  <div className="flex items-center gap-2 text-neutral-500 mt-1">
                    <Clock size={16} />
                    <span className="font-medium">
                      {format(startDate, "hh:mm a")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 px-8">
                  <div className="h-[2px] w-12 md:w-24 bg-neutral-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                      <ArrowRight size={16} className="text-neutral-300" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                    {duration} Days
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2 w-full">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Return
                  </span>
                  <div className="bg-neutral-50 p-3 rounded-sm mb-2">
                    <Calendar size={24} className="text-neutral-900" />
                  </div>
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {format(endDate, "MMMM dd, yyyy")}
                  </span>
                  <div className="flex items-center gap-2 text-neutral-500 mt-1">
                    <Clock size={16} />
                    <span className="font-medium">
                      {format(endDate, "hh:mm a")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 pt-8 border-t border-neutral-100">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Booking Progress
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {progress === 100
                        ? "Rental Period Ended"
                        : progress === 0
                          ? "Waiting to Start"
                          : "Rental in Progress"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-neutral-900">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {booking.location && (
                <div className="mt-8 pt-6 border-t border-neutral-100 flex items-start gap-4">
                  <div className="bg-emerald-50 p-2 rounded-sm text-emerald-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Location
                    </h3>
                    <p className="text-neutral-900 font-semibold">
                      {booking.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <Info size={18} className="text-neutral-900" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                Payment Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Price per Day</span>
                  <span className="font-semibold text-neutral-900">
                    ₱{booking.pricePerDay.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Duration</span>
                  <span className="font-semibold text-neutral-900">
                    {duration} Days
                  </span>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                  <span className="text-base font-bold text-neutral-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    ₱{booking.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-neutral-900" />
                <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                  Payments
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                    paymentStatus.styles,
                  )}
                >
                  {paymentStatus.label}
                </span>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 rounded-sm text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsPaymentSheetOpen(true)}
                >
                  <Plus size={12} />
                  Add Payment
                </Button>
              </div>
            </div>

            {/* Payment Totals */}
            <div className="px-6 pt-4 pb-2 grid grid-cols-3 gap-4 border-b border-neutral-100 bg-neutral-50/30">
              <div className="text-center">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Total Amount
                </p>
                <p className="text-lg font-black text-neutral-900">
                  ₱{booking.totalPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-center border-x border-neutral-100">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Total Paid
                </p>
                <p className="text-lg font-black text-emerald-600">
                  ₱{totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Remaining
                </p>
                <p
                  className={cn(
                    "text-lg font-black",
                    remaining <= 0
                      ? remaining < 0
                        ? "text-amber-600"
                        : "text-emerald-600"
                      : "text-amber-600",
                  )}
                >
                  ₱{Math.abs(remaining).toLocaleString()}{" "}
                  {remaining < 0 && (
                    <span className="text-sm ml-1">(Overpaid)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Payment List */}
            <div className="divide-y divide-neutral-100">
              {isLoadingPayments ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                </div>
              ) : payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-neutral-100 p-3 rounded-full mb-3">
                    <CreditCard size={20} className="text-neutral-400" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-500">
                    No payments recorded yet
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Record the first payment for this booking.
                  </p>
                </div>
              ) : (
                payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="px-6 py-4 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 p-2 rounded-sm text-blue-600 mt-0.5">
                        {METHOD_ICONS[payment.method] ?? (
                          <CreditCard size={14} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">
                          {METHOD_LABELS[payment.method] || payment.method}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {format(new Date(payment.paidDate), "MMM dd, yyyy")}
                        </p>
                        {payment.referenceNumber && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Ref: {payment.referenceNumber}
                          </p>
                        )}
                        {payment.notes && (
                          <p className="text-[11px] text-neutral-400 mt-0.5 italic">
                            {payment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-base font-black text-emerald-600 shrink-0">
                      ₱{payment.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Unit */}
        <div className="space-y-8">
          {/* Customer Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <User size={18} className="text-neutral-900" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                Customer Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Full Name
                </h3>
                <p className="text-sm font-bold text-neutral-900 uppercase tracking-tight">
                  {booking.customerName}
                </p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Phone Number
                </h3>
                <p className="text-sm font-semibold text-neutral-900">
                  {booking.customerPhone}
                </p>
              </div>
              {booking.customerEmail && (
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Email Address
                  </h3>
                  <p className="text-sm font-semibold text-neutral-900">
                    {booking.customerEmail}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Unit Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <Car size={18} className="text-neutral-900" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                Rented Unit
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-neutral-900 p-2 rounded-sm text-white">
                  <Car size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-neutral-900 tracking-tight uppercase leading-tight">
                    {booking.unitName}
                  </p>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">
                    {booking.unitBrand || "Premium Series"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full h-9 text-xs font-bold uppercase tracking-wider border border-neutral-100 hover:bg-neutral-50 rounded-sm"
                onClick={() => router.push(`/units/${booking.unitId}`)}
              >
                View Unit Details
              </Button>
            </div>
          </div>

          {/* Metadata Section */}
          {booking.metadata && (
            <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
                <Tag size={18} className="text-neutral-900" />
                <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                  Metadata Tags
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {booking.metadata
                    .split(", ")
                    .filter(Boolean)
                    .map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-1 rounded-sm text-[10px] font-bold bg-neutral-50 text-neutral-600 border-neutral-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-12 pt-12 border-t border-neutral-200">
        <div className="bg-white border border-red-100 rounded-sm overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-red-50 bg-red-50 flex items-center gap-2">
            <Trash2 size={18} className="text-red-600" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-red-900">
              Danger Zone
            </h2>
          </div>
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                Delete this booking
              </h3>
              <p className="text-sm text-neutral-500 max-w-xl">
                Once you delete a booking, there is no going back. Please be
                certain. This action will permanently remove the booking and all
                associated customer data for this specific reservation.
              </p>
            </div>
            <Button
              variant="destructive"
              className="gap-2 h-11 px-6 rounded-sm font-bold uppercase text-xs tracking-wider shrink-0"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
              Delete Booking
            </Button>
          </div>
        </div>
      </div>

      <AddBookingSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        booking={booking as Booking}
      />

      <DeleteBookingDialog
        booking={booking as Booking}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={() => router.push("/bookings")}
      />

      <RecordPaymentSheet
        open={isPaymentSheetOpen}
        onOpenChange={setIsPaymentSheetOpen}
        bookingId={bookingId}
        bookingTotal={booking.totalPrice}
        totalPaid={totalPaid}
      />
    </div>
  );
}
