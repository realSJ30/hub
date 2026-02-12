"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDown, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { BookingTimePicker } from "./booking-time-picker";

interface BookingDateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  pricePerDay?: number;
  onRangeChange: (range: DateRange | undefined) => void;
  startTimeSelected?: boolean;
  endTimeSelected?: boolean;
  onStartTimeChange: (date: Date | undefined) => void;
  onEndTimeChange: (date: Date | undefined) => void;
  availabilityData?: { startDate: string; endDate: string }[];
  isLoadingAvailability?: boolean;
  onRefreshAvailability?: () => void;
  disabled?: boolean;
  className?: string;
}

export function BookingDateRangePicker({
  startDate,
  endDate,
  pricePerDay,
  onRangeChange,
  startTimeSelected = false,
  endTimeSelected = false,
  onStartTimeChange,
  onEndTimeChange,
  availabilityData = [],
  isLoadingAvailability = false,
  onRefreshAvailability,
  disabled = false,
  className,
}: BookingDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const dateRange: DateRange | undefined = React.useMemo(() => {
    return { from: startDate, to: endDate };
  }, [startDate, endDate]);

  const isDateFullyBooked = React.useCallback(
    (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);

      return availabilityData.some((b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        return start <= d && end >= nextDay;
      });
    },
    [availabilityData],
  );

  const isDatePartiallyBooked = React.useCallback(
    (date: Date) => {
      if (isDateFullyBooked(date)) return false;
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);

      return availabilityData.some((b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        return start < nextDay && end > d;
      });
    },
    [availabilityData, isDateFullyBooked],
  );

  const getDisabledHours = React.useCallback(
    (date: Date | undefined) => {
      if (!date) return [];
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);

      const disabledHours: number[] = [];
      for (let h = 0; h < 24; h++) {
        const hourStart = new Date(d);
        hourStart.setHours(h, 0, 0, 0);
        const hourEnd = new Date(d);
        hourEnd.setHours(h + 1, 0, 0, 0);

        const isBooked = availabilityData.some((b) => {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          return start < hourEnd && end > hourStart;
        });

        if (isBooked) disabledHours.push(h);
      }
      return disabledHours;
    },
    [availabilityData],
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between p-3 text-sm transition-colors",
            disabled
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "hover:bg-neutral-50",
          )}
        >
          <div className="flex items-center gap-2 text-neutral-600">
            <CalendarIcon className="h-4 w-4 text-neutral-400" />
            <span
              className={cn(
                "font-normal",
                !startDate && "text-muted-foreground",
              )}
            >
              {startDate ? (
                endDate && startDate.getTime() !== endDate.getTime() ? (
                  <>
                    {format(startDate, "LLL dd, y")}{" "}
                    {startTimeSelected && format(startDate, "p")} -{" "}
                    {format(endDate, "LLL dd, y")}{" "}
                    {endTimeSelected && format(endDate, "p")}
                  </>
                ) : (
                  <>
                    {format(startDate, "LLL dd, y")}{" "}
                    {startTimeSelected && format(startDate, "p")}
                  </>
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingAvailability && (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-neutral-400 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div className="border-t border-neutral-100 p-3 flex flex-col items-center bg-neutral-50/30 relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-sm hover:bg-neutral-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRefreshAvailability?.();
                }}
                disabled={isLoadingAvailability}
              >
                <RefreshCw
                  size={14}
                  className={cn(isLoadingAvailability && "animate-spin")}
                />
              </Button>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={startDate}
              selected={dateRange}
              onSelect={onRangeChange}
              numberOfMonths={1}
              captionLayout="dropdown"
              className="md:[--cell-size:--spacing(12)]"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString("default", { month: "long" });
                },
              }}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                isDateFullyBooked(date)
              }
              modifiers={{
                fullyBooked: (date) => isDateFullyBooked(date),
                partiallyBooked: (date) => isDatePartiallyBooked(date),
              }}
              modifiersClassNames={{
                fullyBooked: "bg-red-50 text-red-400 line-through",
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  return (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      className={cn(
                        modifiers.fullyBooked &&
                          "text-red-400 bg-red-50/50 line-through cursor-not-allowed opacity-50",
                      )}
                      {...props}
                    >
                      {children}
                      {modifiers.partiallyBooked && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full border border-white" />
                      )}
                    </CalendarDayButton>
                  );
                },
              }}
            />
            <div className="flex gap-4 border-t border-neutral-100 pt-4 w-full">
              <BookingTimePicker
                label="Start Time"
                date={startDate}
                onTimeChange={onStartTimeChange}
                isTimeSelected={startTimeSelected}
                disabledHours={getDisabledHours(startDate)}
              />
              <BookingTimePicker
                label="End Time"
                date={endDate}
                onTimeChange={onEndTimeChange}
                isTimeSelected={endTimeSelected}
                disabledHours={getDisabledHours(endDate)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
