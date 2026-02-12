"use client";

import * as React from "react";
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
  startDate: string | Date;
  endDate: string | Date;
  pricePerDay: number;
  totalPrice: number;
  location: string | null;
  status: string;
  metadata: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdById: string;
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const location = row.original.location;

      return (
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] font-bold text-neutral-400">
            {id.split("_")[1]?.toUpperCase() || id.slice(0, 8).toUpperCase()}
          </span>
          {location && (
            <div className="flex items-center gap-1 text-neutral-500">
              <MapPin size={10} className="text-neutral-400" />
              <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                {location}
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
    accessorKey: "status",
    header: "Status",
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
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const booking = row.original;

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
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("View", booking.id)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Edit", booking.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Booking
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => console.log("Delete", booking.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
