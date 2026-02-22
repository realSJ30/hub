"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MapPin,
  Calendar,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/utils/constants/booking";

export type Booking = {
  id: string;
  unitId: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  unitName?: string;
  unitBrand?: string;
  startDate: string | Date;
  endDate: string | Date;
  pricePerDay: number;
  totalPrice: number;
  totalPaid?: number;
  location: string | null;
  status: string;
  metadata: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdById: string;
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "unitName",
    header: "Unit",
    cell: ({ row }) => {
      const unitName = row.getValue("unitName") as string;
      const location = row.original.location;

      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-neutral-900">
            {unitName || "Unknown Unit"}
          </span>
          {location && (
            <div className="flex items-center gap-1 text-neutral-500">
              <MapPin size={10} className="text-neutral-400" />
              <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                {location || "N/A"}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-900">
            {row.original.customerName || "Unknown Customer"}
          </span>
          <span className="text-[11px] text-neutral-500">
            {row.original.customerEmail || "No email provided"}
          </span>
        </div>
      );
    },
  },
  {
    id: "schedule",
    header: "Schedule",
    cell: ({ row }) => {
      const start = new Date(row.original.startDate);
      const end = new Date(row.original.endDate);
      const now = new Date();

      // Calculate progress
      const total = end.getTime() - start.getTime();
      const current = now.getTime() - start.getTime();
      const progress = Math.min(Math.max((current / total) * 100, 0), 100);

      const isCompleted = now > end;
      const isAwaiting = now < start;

      return (
        <div className="flex flex-col gap-3 min-w-[200px]">
          {/* Progress Bar Row */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
              <span
                className={isAwaiting ? "text-amber-600" : "text-neutral-400"}
              >
                {isAwaiting ? "Awaiting" : "Started"}
              </span>
              <span
                className={
                  isCompleted ? "text-emerald-600" : "text-neutral-400"
                }
              >
                {isCompleted ? "Completed" : "Ending"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  isCompleted
                    ? "bg-emerald-500"
                    : isAwaiting
                      ? "bg-neutral-200"
                      : "bg-neutral-900",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Side-by-Side row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-neutral-50 p-1.5 rounded-sm">
                <Calendar size={12} className="text-neutral-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-neutral-900 leading-none">
                  {format(start, "MMM dd")}
                </span>
                <span className="text-[10px] text-neutral-500 mt-1">
                  {format(start, "hh:mm a")}
                </span>
              </div>
            </div>

            <ArrowRight size={12} className="text-neutral-300" />

            <div className="flex items-center gap-2">
              <div className="bg-neutral-50 p-1.5 rounded-sm">
                <Calendar size={12} className="text-neutral-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-neutral-900 leading-none">
                  {format(end, "MMM dd")}
                </span>
                <span className="text-[10px] text-neutral-500 mt-1">
                  {format(end, "hh:mm a")}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return (
        <div className="text-right flex flex-col items-end gap-0.5">
          <span className="font-bold text-neutral-900">{formatted}</span>
          <span className="text-[10px] text-neutral-500">
            ₱{row.original.pricePerDay.toLocaleString()}/day
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Booking Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const label = BOOKING_STATUS_LABELS[status] || status;
      const styles =
        BOOKING_STATUS_STYLES[status] ||
        "bg-neutral-50 text-neutral-700 border-neutral-200";

      return (
        <div
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles}`}
        >
          {label}
        </div>
      );
    },
  },
  {
    id: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const totalPrice = row.original.totalPrice;
      const totalPaid = row.original.totalPaid || 0;

      let label = "Partially Paid";
      let styles = "bg-amber-50 text-amber-700 border-amber-200";

      if (totalPaid <= 0) {
        label = "Unpaid";
        styles = "bg-red-50 text-red-700 border-red-200";
      } else if (totalPaid >= totalPrice) {
        label = "Paid";
        styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      }

      const remaining = Math.max(totalPrice - totalPaid, 0);
      const isPartiallyPaid = totalPaid > 0 && totalPaid < totalPrice;

      return (
        <div className="flex items-center gap-1.5 relative group cursor-default">
          <div
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles}`}
          >
            {label}
          </div>
          {isPartiallyPaid && (
            <>
              <Info size={14} className="text-neutral-400" />
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-neutral-900 text-white text-xs font-semibold px-3 py-2 rounded-sm shadow-md invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-neutral-900">
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-400">Total Paid:</span>
                  <span className="text-emerald-400">
                    ₱{totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Remaining:</span>
                  <span className="text-amber-400">
                    ₱{remaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const booking = row.original;
      const router = useRouter();

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-neutral-400 hover:text-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/bookings/${booking.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (table.options.meta as any)?.onEdit?.(booking)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Booking
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.onRecordPayment?.(booking)
                }
              >
                <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                Record Payment
              </DropdownMenuItem>
              {booking.status !== "COMPLETED" && (
                <DropdownMenuItem
                  className="text-emerald-600 focus:text-emerald-600"
                  onClick={() =>
                    (table.options.meta as any)?.onStatusUpdate?.(
                      booking.id,
                      "COMPLETED",
                    )
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                  Mark Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => (table.options.meta as any)?.onDelete?.(booking)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
