"use client";

import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/hooks";
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
import { useState } from "react";
import { type Booking } from "../columns";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data: result, isLoading, isError, error } = useBooking(bookingId);
  const booking = result?.data;

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
  const duration = Math.max(differenceInDays(endDate, startDate), 1);
  const statusLabel = BOOKING_STATUS_LABELS[booking.status] || booking.status;
  const statusStyles =
    BOOKING_STATUS_STYLES[booking.status] || "bg-neutral-100 text-neutral-700";

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
            variant="outline"
            className="gap-2 h-10 rounded-sm border-neutral-200"
            onClick={() => setIsEditSheetOpen(true)}
          >
            <Edit size={16} />
            Edit Booking
          </Button>
          <Button
            variant="destructive"
            className="gap-2 h-10 rounded-sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 size={16} />
            Delete
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
                    Drop Off
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
    </div>
  );
}
