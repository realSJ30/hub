import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { AddUnitSheet } from "./add-unit-sheet";
import { UnitFiltersDropdown } from "./unit-filters-dropdown";
import type { UnitFilters } from "@/lib/validations/unit.schema";

interface UnitsTableHeaderProps {
  filters: UnitFilters;
  onFilterChange: (filters: UnitFilters) => void;
}

export const UnitsTableHeader = ({
  filters,
  onFilterChange,
}: UnitsTableHeaderProps) => {
  const hasFilters = Object.keys(filters).length > 0;

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
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({})}
            className="h-9 px-3 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-sm"
          >
            Clear All
          </Button>
        )}
        <UnitFiltersDropdown
          filters={filters}
          onFilterChange={onFilterChange}
        />
        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-sm">
          <Download size={16} />
          Export CSV
        </Button>
        <AddUnitSheet />
      </div>
    </div>
  );
};
