"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";

export const BookingsTableHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Bookings List</h1>
        <p className="text-neutral-500 text-sm">
          Overview of all rental bookings and their current status.
        </p>
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
          className="gap-2 h-9 rounded-sm bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          <Plus size={16} />
          New Booking
        </Button>
      </div>
    </div>
  );
};
