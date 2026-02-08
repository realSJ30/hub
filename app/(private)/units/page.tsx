"use client";

import { UnitsTableHeader } from "./components/units-table-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useUnits } from "@/hooks";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UnitsPage = () => {
  const { data, isLoading, isError, error } = useUnits();

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <UnitsTableHeader />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">Loading units...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load units. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      {!isLoading && !isError && data?.data && (
        <DataTable columns={columns} data={data.data} />
      )}
    </div>
  );
};

export default UnitsPage;
