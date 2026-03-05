"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  Filter,
  List as ListIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingsTableHeaderProps {
  onAdd: () => void;
  viewMode: "list" | "calendar";
  setViewMode: (val: "list" | "calendar") => void;
}

export const BookingsTableHeader = ({
  onAdd,
  viewMode,
  setViewMode,
}: BookingsTableHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          {viewMode === "list" ? "Bookings List" : "Booking Calendar"}
        </h1>
        <p className="text-neutral-500 text-sm">
          Overview of all rental bookings and their current status.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-sm border border-neutral-200 bg-neutral-50/50 p-1">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-xs font-bold transition-colors uppercase tracking-widest",
              viewMode === "list"
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
            )}
          >
            <ListIcon size={14} />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-xs font-bold transition-colors uppercase tracking-widest",
              viewMode === "calendar"
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
            )}
          >
            <CalendarIcon size={14} />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-9 rounded-sm">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-9 rounded-sm">
            <Download size={16} />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2 h-9 rounded-sm bg-primary hover:bg-primary/90"
            onClick={onAdd}
          >
            <Plus size={16} />
            Add New Booking
          </Button>
        </div>
      </div>
    </div>
  );
};
