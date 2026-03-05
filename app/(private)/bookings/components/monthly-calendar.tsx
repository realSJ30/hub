"use client";

import { useState } from "react";
import { type Booking } from "../../bookings/columns";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  max,
  min,
  differenceInCalendarDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MonthlyCalendarProps {
  bookings: Booking[];
}

interface EventSpan {
  booking: Booking;
  startCol: number;
  colSpan: number;
}

export function MonthlyCalendar({ bookings }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const renderHeader = () => {
    const daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50/50 shrink-0">
        {daysName.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-bold uppercase tracking-widest text-neutral-500 border-r border-neutral-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekEvents = (week: Date[]) => {
    const weekStart = startOfDay(week[0]);
    const weekEnd = endOfDay(week[6]);

    const weekEvents = bookings.filter((b) => {
      if (b.status === "CANCELLED" || b.status === "NO_SHOW") return false;

      const bStart = startOfDay(new Date(b.startDate));
      const bEnd = endOfDay(new Date(b.endDate));
      return bStart <= weekEnd && bEnd >= weekStart;
    });

    const spans: EventSpan[] = weekEvents.map((b) => {
      const bStart = startOfDay(new Date(b.startDate));
      const bEnd = endOfDay(new Date(b.endDate));
      const actualStart = max([bStart, weekStart]);
      const actualEnd = min([bEnd, weekEnd]);

      const startCol = differenceInCalendarDays(actualStart, weekStart);
      const colSpan = differenceInCalendarDays(actualEnd, actualStart) + 1;

      return { booking: b, startCol, colSpan };
    });

    // Sort by actual start date (earlier first), then by longer span
    spans.sort((a, b) => {
      const startDiff =
        new Date(a.booking.startDate).getTime() -
        new Date(b.booking.startDate).getTime();
      if (startDiff !== 0) return startDiff;
      return b.colSpan - a.colSpan;
    });

    // Simple bin packing layout finding rows for each event
    const rows: EventSpan[][] = [];
    spans.forEach((span) => {
      let placed = false;
      for (const row of rows) {
        const conflict = row.some(
          (existing) =>
            !(
              span.startCol + span.colSpan <= existing.startCol ||
              span.startCol >= existing.startCol + existing.colSpan
            ),
        );
        if (!conflict) {
          row.push(span);
          placed = true;
          break;
        }
      }
      if (!placed) {
        rows.push([span]);
      }
    });

    return (
      <div className="absolute top-12 left-0 right-0 bottom-0 pointer-events-none px-1 flex flex-col gap-1 overflow-y-auto no-scrollbar pb-1 z-10">
        {rows.map((row, rIndex) => (
          <div key={rIndex} className="relative h-6 shrink-0 w-full">
            {row.map((ev) => {
              const leftPercent = (ev.startCol / 7) * 100;
              const widthPercent = (ev.colSpan / 7) * 100;

              let colorClass =
                "bg-neutral-100 border-neutral-300 text-neutral-700";
              switch (ev.booking.status) {
                case "PENDING":
                  colorClass = "bg-amber-100 border-amber-300 text-amber-800";
                  break;
                case "CONFIRMED":
                  colorClass = "bg-blue-100 border-blue-300 text-blue-800";
                  break;
                case "IN_PROGRESS":
                  colorClass =
                    "bg-indigo-100 border-indigo-300 text-indigo-800";
                  break;
                case "COMPLETED":
                  colorClass =
                    "bg-neutral-100 border-neutral-300 text-neutral-500 opacity-60";
                  break;
              }

              return (
                <div
                  key={ev.booking.id}
                  className={cn(
                    "absolute h-full rounded shadow-sm border px-2.5 py-0.5 text-xs pointer-events-auto flex items-center overflow-hidden transition-all hover:-translate-y-px hover:shadow-md cursor-default",
                    colorClass,
                  )}
                  style={{
                    left: `calc(${leftPercent}% + 2px)`,
                    width: `calc(${widthPercent}% - 4px)`,
                  }}
                  title={`Unit: ${ev.booking.unitName}\nCustomer: ${ev.booking.customerName}\nStatus: ${ev.booking.status}\nFrom: ${format(new Date(ev.booking.startDate), "MMM dd, yyyy")}\nTo: ${format(new Date(ev.booking.endDate), "MMM dd, yyyy")}`}
                >
                  <div className="truncate flex items-center gap-1.5 w-full">
                    <span className="font-bold shrink-0">
                      {ev.booking.unitName}
                    </span>
                    <span className="truncate opacity-80 min-w-0">
                      &bull; {ev.booking.customerName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Area */}
      <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-200 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <Button
            onClick={goToToday}
            variant="outline"
            className="h-9 px-4 rounded-sm font-bold text-xs uppercase tracking-wider"
          >
            Today
          </Button>
          <div className="flex items-center rounded-sm overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-neutral-50 transition-colors border-r border-neutral-200 text-neutral-600"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-neutral-50 transition-colors text-neutral-600"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} className="text-primary hidden sm:block" />
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tighter w-48 text-right">
            {format(currentDate, dateFormat)}
          </h2>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col min-h-0 bg-neutral-100">
        {renderHeader()}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar gap-px bg-neutral-200">
          {weeks.map((week, index) => (
            <div
              key={index}
              className="relative flex-1 bg-white grid grid-cols-7 min-h-[140px]"
            >
              {/* Day cells (background grid) */}
              {week.map((day) => {
                const isMonth = isSameMonth(day, currentDate);
                const today = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "border-r border-neutral-100 last:border-r-0 h-full p-2 flex flex-col items-center",
                      !isMonth ? "bg-neutral-50/80" : "bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full mt-1",
                        today
                          ? "bg-primary text-white shadow-sm"
                          : isMonth
                            ? "text-neutral-700 hover:bg-neutral-100/50 transition-colors"
                            : "text-neutral-400",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                );
              })}

              {/* Events layer for this week */}
              {renderWeekEvents(week)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
