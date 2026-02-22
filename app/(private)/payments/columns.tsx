"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Banknote,
  Smartphone,
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
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import { cn } from "@/lib/utils";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  online_banking: "Online Banking",
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote size={12} />,
  online_banking: <Smartphone size={12} />,
};

const METHOD_BADGE_STYLES: Record<string, string> = {
  cash: "bg-emerald-50 text-emerald-700 border-emerald-200",
  online_banking: "bg-purple-50 text-purple-700 border-purple-200",
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  referenceNumber: string | null;
  paidDate: string | Date;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  customerName?: string;
  unitName?: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paidDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.paidDate);
      let contextLabel = "";

      if (isToday(date)) contextLabel = "Today";
      else if (isThisWeek(date, { weekStartsOn: 1 }))
        contextLabel = "This week";
      else if (isThisMonth(date)) contextLabel = "This month";

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900 text-xs">
            {format(date, "MMM dd, yyyy")}
          </span>
          <span className="text-[10px] text-neutral-400">{contextLabel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "bookingContext",
    header: "Booking / Customer",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900 text-xs">
            {row.original.unitName || "Unknown Unit"}
          </span>
          <span className="text-[10px] text-neutral-400">
            {row.original.customerName || "Unknown Customer"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;

      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border",
            METHOD_BADGE_STYLES[method] ||
              "bg-neutral-50 text-neutral-600 border-neutral-200",
          )}
        >
          {METHOD_ICONS[method]}
          {METHOD_LABELS[method] || method}
        </span>
      );
    },
  },
  {
    accessorKey: "referenceNumber",
    header: "Reference",
    cell: ({ row }) => {
      const ref = row.original.referenceNumber;
      return (
        <span className="text-xs text-neutral-500 font-mono">{ref || "—"}</span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return (
        <div className="text-right">
          <span className="text-sm font-black text-emerald-600">
            {formatted}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const payment = row.original;

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
                onClick={() => (table.options.meta as any)?.onEdit?.(payment)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Payment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => (table.options.meta as any)?.onDelete?.(payment)}
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
