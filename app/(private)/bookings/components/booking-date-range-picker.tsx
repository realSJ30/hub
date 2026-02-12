"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";
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
  className,
}: BookingDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const dateRange: DateRange | undefined = React.useMemo(() => {
    return { from: startDate, to: endDate };
  }, [startDate, endDate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 text-sm hover:bg-neutral-50 transition-colors"
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
          <ChevronDown
            className={cn(
              "h-4 w-4 text-neutral-400 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="border-t border-neutral-100 p-3 flex flex-col items-center bg-neutral-50/30">
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
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  return (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      {...props}
                    >
                      {children}
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
              />
              <BookingTimePicker
                label="End Time"
                date={endDate}
                onTimeChange={onEndTimeChange}
                isTimeSelected={endTimeSelected}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
