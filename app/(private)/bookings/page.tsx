"use client";

import { BookingsTableHeader } from "./components/bookings-table-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  BOOKINGS_MOCK_DATA,
  CUSTOMERS_MOCK_DATA,
} from "@/utils/constants/mock";

import { useBookings } from "@/hooks";
import { Loader2, AlertCircle } from "lucide-react";

const BookingsPage = () => {
  const { data: bookingsResult, isLoading, isError, error } = useBookings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-neutral-500 text-sm animate-pulse">
          Loading bookings...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 p-4 rounded-sm flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">
            Error: {error?.message || "Failed to load bookings"}
          </p>
        </div>
      </div>
    );
  }

  const data = bookingsResult?.data || [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <BookingsTableHeader />

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default BookingsPage;
