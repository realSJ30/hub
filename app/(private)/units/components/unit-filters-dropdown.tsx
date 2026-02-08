"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, RotateCcw } from "lucide-react";
import type { UnitFilters } from "@/lib/validations/unit.schema";

interface UnitFiltersDropdownProps {
  filters: UnitFilters;
  onFilterChange: (filters: UnitFilters) => void;
}

export const UnitFiltersDropdown = ({
  filters,
  onFilterChange,
}: UnitFiltersDropdownProps) => {
  const [localFilters, setLocalFilters] = React.useState<UnitFilters>(filters);

  // Update local filters when global filters change (e.g. on clear)
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const cleared = {};
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const updateFilter = (key: keyof UnitFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === "ALL" ? undefined : value,
    }));
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          size="sm"
          className="gap-2 h-9 rounded-sm relative"
        >
          <Filter size={16} />
          Filter
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] p-4 space-y-4"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between">
          <DropdownMenuLabel className="p-0 font-bold text-base">
            Filters
          </DropdownMenuLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 px-2 text-xs text-neutral-500 hover:text-neutral-900 gap-1.5"
          >
            <RotateCcw size={12} />
            Reset
          </Button>
        </div>

        <DropdownMenuSeparator className="-mx-4" />

        <div className="grid gap-4 py-2 overflow-y-auto max-h-[70vh] px-1">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
              Name
            </Label>
            <Input
              placeholder="Search name..."
              value={localFilters.name || ""}
              onChange={(e) => updateFilter("name", e.target.value)}
              className="h-9"
            />
          </div>

          {/* Brand & Status */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Brand
              </Label>
              <Input
                placeholder="Search brand..."
                value={localFilters.brand || ""}
                onChange={(e) => updateFilter("brand", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Status
              </Label>
              <Select
                value={localFilters.status || "ALL"}
                onValueChange={(val) => updateFilter("status", val)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="RENTED">Rented</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plate & Transmission */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Plate
              </Label>
              <Input
                placeholder="Plate #..."
                value={localFilters.plate || ""}
                onChange={(e) => updateFilter("plate", e.target.value)}
                className="h-9 uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Trans.
              </Label>
              <Select
                value={localFilters.transmission || "ALL"}
                onValueChange={(val) => updateFilter("transmission", val)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DropdownMenuSeparator className="-mx-1" />

          {/* Numeric Sliders */}
          <div className="space-y-4 pt-1">
            <Slider
              label="Min Year"
              min={2010}
              max={new Date().getFullYear() + 1}
              step={1}
              value={localFilters.yearMin || 1990}
              onChange={(e) =>
                updateFilter("yearMin", parseInt(e.target.value))
              }
              valueDisplay={localFilters.yearMin?.toString() || "1990"}
            />

            <Slider
              label="Min Capacity"
              min={1}
              max={30}
              step={1}
              value={localFilters.capacityMin || 1}
              onChange={(e) =>
                updateFilter("capacityMin", parseInt(e.target.value))
              }
              valueDisplay={`${localFilters.capacityMin || 1} pax`}
            />

            <Slider
              label="Max Price/Day"
              min={0}
              max={10000}
              step={100}
              value={localFilters.priceMax || 50000}
              onChange={(e) =>
                updateFilter("priceMax", parseFloat(e.target.value))
              }
              valueDisplay={`₱${(localFilters.priceMax || 50000).toLocaleString()}`}
            />
          </div>
        </div>

        <DropdownMenuSeparator className="-mx-4" />

        <div className="flex gap-2">
          <Button className="flex-1 rounded-sm h-9" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
