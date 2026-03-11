"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { UnitStatusBadge } from "./components/unit-status-badge";
import { UnitActions } from "./components/unit-actions";
import type { SerializedUnit } from "@/lib/serializers/unit.serializer";

export type Unit = SerializedUnit;

/** Small inline component so each row can manage its own lightbox state */
function UnitImageThumbnail({ unit }: { unit: Unit }) {
  const [open, setOpen] = React.useState(false);

  if (!unit.imageUrl) {
    return (
      <div className="h-10 w-12 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
        <span className="text-[9px] text-neutral-400 font-medium text-center leading-tight px-0.5">
          No Image
        </span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="relative h-10 w-12 rounded bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 group hover:ring-2 hover:ring-primary/40 transition-all"
        onClick={() => setOpen(true)}
        title="View image"
      >
        <Image
          src={unit.imageUrl}
          alt={unit.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-2">
          <DialogTitle className="sr-only">{unit.name} — Image Preview</DialogTitle>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image
              src={unit.imageUrl}
              alt={unit.name}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const columns: ColumnDef<Unit>[] = [
  /* ── Image ──────────────────────────────────────────────────────── */
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => <UnitImageThumbnail unit={row.original} />,
  },
  /* ── Unit Name ──────────────────────────────────────────────────── */
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
        <p className="font-medium text-neutral-900">
          {unit.name}
          <br />
          <span className="text-neutral-400 text-xs">{unit.year}</span>
        </p>
      );
    },
  },
  /* ── Brand ──────────────────────────────────────────────────────── */
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
  /* ── Plate ──────────────────────────────────────────────────────── */
  {
    accessorKey: "plate",
    header: "Plate",
    cell: ({ row }) => (
      <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono font-semibold text-neutral-700">
        {row.getValue("plate")}
      </span>
    ),
  },
  /* ── Transmission ───────────────────────────────────────────────── */
  {
    accessorKey: "transmission",
    header: "Transmission",
    cell: ({ row }) => (
      <span className="text-neutral-600">{row.getValue("transmission")}</span>
    ),
  },
  /* ── Capacity ───────────────────────────────────────────────────── */
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
  /* ── Price ──────────────────────────────────────────────────────── */
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
  /* ── Status ─────────────────────────────────────────────────────── */
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UnitStatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  /* ── Actions ────────────────────────────────────────────────────── */
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <UnitActions unit={row.original} />,
  },
];
