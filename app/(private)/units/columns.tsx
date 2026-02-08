"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitStatusBadge } from "./components/unit-status-badge";
import { UnitActions } from "./components/unit-actions";
import type { SerializedUnit } from "@/lib/serializers/unit.serializer";

export type Unit = SerializedUnit;

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
          <p className="font-medium text-neutral-900">
            {unit.name}
            <br />
            <span className="text-neutral-400 text-xs">{unit.year}</span>
          </p>
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
    cell: ({ row }) => (
      <span className="text-neutral-600 font-medium">
        {row.getValue("brand")}
      </span>
    ),
  },
  {
    accessorKey: "plate",
    header: "Plate",
    cell: ({ row }) => (
      <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono font-semibold text-neutral-700">
        {row.getValue("plate")}
      </span>
    ),
  },
  {
    accessorKey: "transmission",
    header: "Transmission",
    cell: ({ row }) => (
      <span className="text-neutral-600">{row.getValue("transmission")}</span>
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
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
    ),
    cell: ({ row }) => (
      <div className="text-center text-neutral-600">
        {row.getValue("capacity")}pax
      </div>
    ),
  },
  {
    accessorKey: "pricePerDay",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("pricePerDay"));
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
    cell: ({ row }) => <UnitStatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <UnitActions unit={row.original} />,
  },
];
