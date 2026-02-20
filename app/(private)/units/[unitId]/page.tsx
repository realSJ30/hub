"use client";

import { useParams, useRouter } from "next/navigation";
import { useUnit, useBookingsByUnit, useUpdateBookingStatus } from "@/hooks";
import {
  Loader2,
  ChevronLeft,
  Car,
  AlertTriangle,
  History,
  User,
  ArrowRight,
  Info,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnitStatusBadge } from "../components/unit-status-badge";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/utils/constants/booking";
import { useState } from "react";
import { EditUnitSheet } from "../components/edit-unit-sheet";
import { DeleteUnitDialog } from "../components/delete-unit-dialog";
import { AddBookingSheet } from "../../bookings/components/add-booking-sheet";

export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.unitId as string;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const {
    data: unitResult,
    isLoading: unitLoading,
    isError: unitError,
  } = useUnit(unitId);
  const { data: bookingsResult, isLoading: bookingsLoading } =
    useBookingsByUnit(unitId);
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const unit = unitResult?.data;
  const bookings = bookingsResult?.data || [];

  if (unitLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-400 mb-4" />
        <p className="text-neutral-500 font-medium tracking-tight">
          Loading unit details...
        </p>
      </div>
    );
  }

  if (unitError || !unit) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2 text-neutral-500 hover:text-neutral-900"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Units
        </Button>
        <div className="bg-red-50 border border-red-100 p-8 rounded-sm text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Unit Not Found
          </h2>
          <p className="text-red-700 mb-6">
            The requested unit could not be found or you don't have access to
            it.
          </p>
          <Button onClick={() => router.push("/units")} className="rounded-sm">
            Return to Units List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2 text-neutral-500 hover:text-neutral-900 h-8 text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          Back to Units
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
                {unit.name}
              </h1>
              <UnitStatusBadge status={unit.status} />
            </div>
            <p className="text-neutral-500 font-medium">
              {unit.brand} • {unit.year} • {unit.plate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(true)}
              className="gap-2 h-9 rounded-sm"
            >
              <Edit2 size={14} />
              Edit Unit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-2 h-9 rounded-sm bg-destructive hover:bg-destructive/90"
            >
              <Trash2 size={14} />
              Delete
            </Button>
            <Button
              onClick={() => setIsNewBookingOpen(true)}
              className="gap-2 h-9 rounded-sm bg-primary hover:bg-primary/90"
            >
              <Plus size={14} />
              New Booking
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unit Info Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Image Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="relative aspect-video bg-neutral-100 overflow-hidden">
              {unit.imageUrl ? (
                <Image
                  src={unit.imageUrl}
                  alt={unit.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
                  <Car size={64} strokeWidth={1} />
                  <span className="text-xs font-bold uppercase tracking-widest mt-4">
                    No Image Available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Specifications
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Transmission
                  </label>
                  <p className="text-sm font-black text-neutral-900 uppercase">
                    {unit.transmission}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Capacity
                  </label>
                  <p className="text-sm font-black text-neutral-900 uppercase">
                    {unit.capacity} PAX
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Price / Day
                  </label>
                  <p className="text-sm font-black text-emerald-600">
                    ₱{unit.pricePerDay.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Plate Number
                  </label>
                  <p className="text-sm font-black text-neutral-900 uppercase font-mono">
                    {unit.plate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking History Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={16} className="text-neutral-900" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900">
                  Booking History
                </h3>
              </div>
              <Badge
                variant="secondary"
                className="bg-neutral-100 text-neutral-600 rounded-sm text-[10px] font-bold"
              >
                {bookings.length} TOTAL BOOKINGS
              </Badge>
            </div>

            <div className="overflow-x-auto">
              {bookingsLoading ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-300 mb-2" />
                  <p className="text-xs text-neutral-400 font-medium">
                    Fetching history...
                  </p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Info className="h-8 w-8 text-neutral-200 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 font-medium">
                    No booking history for this unit yet.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/20">
                      <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        Schedule
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {bookings.map((booking: any) => {
                      const statusStyles =
                        BOOKING_STATUS_STYLES[booking.status] ||
                        "bg-neutral-50 text-neutral-700";
                      const statusLabel =
                        BOOKING_STATUS_LABELS[booking.status] || booking.status;

                      return (
                        <tr
                          key={booking.id}
                          className="group hover:bg-neutral-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                                <User size={14} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                                  {booking.customerName}
                                </p>
                                <p className="text-[10px] text-neutral-500">
                                  {booking.customerPhone}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <p className="text-[10px] font-bold text-neutral-900">
                                  {format(
                                    new Date(booking.startDate),
                                    "MMM dd",
                                  )}
                                </p>
                                <p className="text-[8px] text-neutral-400 uppercase">
                                  {format(
                                    new Date(booking.startDate),
                                    "hh:mm a",
                                  )}
                                </p>
                              </div>
                              <ArrowRight
                                size={12}
                                className="text-neutral-200"
                              />
                              <div className="text-center">
                                <p className="text-[10px] font-bold text-neutral-900">
                                  {format(new Date(booking.endDate), "MMM dd")}
                                </p>
                                <p className="text-[8px] text-neutral-400 uppercase">
                                  {format(new Date(booking.endDate), "hh:mm a")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-block px-2 py-0.5 rounded-full text-[9px] font-black border tracking-tighter uppercase",
                                statusStyles,
                              )}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Link href={`/bookings/${booking.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-[10px] font-bold uppercase tracking-wider border border-neutral-100 hover:bg-neutral-50 rounded-sm"
                                >
                                  View
                                </Button>
                              </Link>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-neutral-400 hover:text-neutral-900"
                                  >
                                    <MoreVertical size={14} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40"
                                >
                                  {booking.status !== "COMPLETED" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatus({
                                          id: booking.id,
                                          status: "COMPLETED",
                                        })
                                      }
                                      className="text-emerald-600 focus:text-emerald-600 font-medium"
                                    >
                                      <CheckCircle size={14} className="mr-2" />
                                      Mark Completed
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/bookings/${booking.id}`)
                                    }
                                  >
                                    <Info size={14} className="mr-2" />
                                    Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditUnitSheet
        unit={unit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteUnitDialog
        unit={unit}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={() => router.push("/units")}
      />

      <AddBookingSheet
        open={isNewBookingOpen}
        onOpenChange={setIsNewBookingOpen}
        defaultUnitId={unitId}
      />
    </div>
  );
}
