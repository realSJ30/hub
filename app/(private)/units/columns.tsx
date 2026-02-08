"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitStatusBadge } from "./components/unit-status-badge";

export type Unit = {
  id: string;
  name: string;
  brand: string;
  plate: string;
  transmission: string;
  capacity: number;
  price: number;
  status: string;
  imageUrl: string | null;
};

export const columns: ColumnDef<Unit>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Unit Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const unit = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-12 rounded bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
            {unit.imageUrl ? (
              <Image
                src={unit.imageUrl}
                alt={unit.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400 font-medium text-center leading-tight p-1">
                No Image
              </div>
            )}
          </div>
          <span className="font-medium text-neutral-900">{unit.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Brand
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-neutral-600 font-medium">
          {row.getValue("brand")}
        </span>
      );
    },
  },
  {
    accessorKey: "plate",
    header: "Plate",
    cell: ({ row }) => {
      return (
        <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono font-semibold text-neutral-700">
          {row.getValue("plate")}
        </span>
      );
    },
  },
  {
    accessorKey: "transmission",
    header: "Transmission",
    cell: ({ row }) => {
      return (
        <span className="text-neutral-600">{row.getValue("transmission")}</span>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            Capacity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center text-neutral-600">
          {row.getValue("capacity")}pax
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <div>
          <span className="font-bold text-neutral-900">
            ₱{price.toLocaleString()}
          </span>
          <span className="text-[10px] text-neutral-400 block ml-0.5">
            /day
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <UnitStatusBadge status={row.getValue("status")} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-500 hover:text-primary"
            onClick={() => console.log("View", row.original.id)}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-500 hover:text-primary"
            onClick={() => console.log("Edit", row.original.id)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-500 hover:text-red-600"
            onClick={() => console.log("Delete", row.original.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];
