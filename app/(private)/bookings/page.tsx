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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BookingsPage = () => {
  const { data: bookingsResult, isLoading, isError, error } = useBookings();

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <BookingsTableHeader />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm mt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-500 font-medium animate-pulse">
                Loading bookings...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load bookings. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && (
        <div className="mt-6">
          <DataTable columns={columns} data={bookingsResult?.data || []} />
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
