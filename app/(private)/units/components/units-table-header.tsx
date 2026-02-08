import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { AddUnitSheet } from "./add-unit-sheet";

export const UnitsTableHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Units Management
        </h1>
        <p className="text-neutral-500 text-sm">
          Manage and monitor all your rental units in one place.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-sm">
          <Filter size={16} />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-sm">
          <Download size={16} />
          Export CSV
        </Button>
        <AddUnitSheet />
      </div>
    </div>
  );
};
