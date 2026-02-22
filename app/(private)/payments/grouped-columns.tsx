"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type GroupedBookingPayment = {
  bookingId: string;
  customerName: string;
  unitName: string;
  totalPrice: number;
  totalPaid: number;
  remaining: number;
  paymentStatus: {
    label: string;
    styles: string;
  };
  lastPaymentDate: Date;
  payments: any[];
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(val);

export const groupedColumns: ColumnDef<GroupedBookingPayment>[] = [
  {
    accessorKey: "bookingId",
    header: "Booking ID",
    cell: ({ row }) => (
      <span className="font-mono text-[10px] text-neutral-500">
        {row.original.bookingId.split("-")[0]}...
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer / Unit",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-900 text-xs">
          {row.original.customerName}
        </span>
        <span className="text-[10px] text-neutral-400">
          {row.original.unitName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-right">Total Price</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium text-neutral-900">
        {formatCurrency(row.original.totalPrice)}
      </div>
    ),
  },
  {
    accessorKey: "totalPaid",
    header: () => <div className="text-right">Paid</div>,
    cell: ({ row }) => (
      <div className="text-right font-bold text-emerald-600">
        {formatCurrency(row.original.totalPaid)}
      </div>
    ),
  },
  {
    accessorKey: "remaining",
    header: () => <div className="text-right">Remaining</div>,
    cell: ({ row }) => {
      const remaining = row.original.remaining;
      return (
        <div
          className={cn(
            "text-right font-black",
            remaining <= 0 ? "text-emerald-600" : "text-amber-600",
          )}
        >
          {formatCurrency(Math.abs(remaining))}
          {remaining < 0 && (
            <span className="text-[8px] ml-1 tracking-tighter">(OVER)</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
          row.original.paymentStatus.styles,
        )}
      >
        {row.original.paymentStatus.label}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const bookingId = row.original.bookingId;

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
              <DropdownMenuLabel>Booking Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.onViewDetails?.(bookingId)
                }
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.onRecordPayment?.(row.original)
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Record Payment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
