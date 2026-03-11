"use client";

import { useState } from "react";
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
  endOfDay,
  startOfDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DashboardCalendarProps {
  bookings: any[];
}

export default function DashboardCalendar({ bookings }: DashboardCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Determine bookings per day for the mini badges
  const getBookingsForDay = (day: Date) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    return bookings.filter((b) => {
      if (b.status === "CANCELLED" || b.status === "NO_SHOW") return false;
      const bStart = startOfDay(new Date(b.startDate));
      const bEnd = endOfDay(new Date(b.endDate));
      return bStart <= dayEnd && bEnd >= dayStart;
    });
  };

  const daysName = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const renderCalendarGrid = (isExpanded: boolean) => {
    return (
      <div className={cn("flex flex-col", isExpanded ? "h-full bg-white p-6" : "flex-1")}>
        {/* Calendar Header Controls */}
        <div className={cn("flex items-center justify-between", isExpanded ? "mb-6" : "mb-4")}>
          <span className={cn("font-bold text-neutral-900 tracking-tight", isExpanded ? "text-xl" : "text-[15px]")}>
            {format(currentDate, "MMMM yyyy")}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className={cn(
                "hover:bg-neutral-100 rounded-md transition-colors text-neutral-600",
                isExpanded ? "p-2" : "p-1.5"
              )}
            >
              <ChevronLeft size={isExpanded ? 20 : 16} />
            </button>
            <button
              onClick={nextMonth}
              className={cn(
                "hover:bg-neutral-100 rounded-md transition-colors text-neutral-600",
                isExpanded ? "p-2" : "p-1.5"
              )}
            >
              <ChevronRight size={isExpanded ? 20 : 16} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={cn(
          "grid grid-cols-7 gap-px bg-neutral-200 border border-neutral-200 overflow-hidden",
          isExpanded ? "flex-1 rounded-xl" : "rounded-lg"
        )}>
          {daysName.map((day) => (
            <div
              key={day}
              className={cn(
                "text-center font-bold text-neutral-400 bg-neutral-50",
                isExpanded ? "text-xs py-3" : "text-[11px] py-1.5"
              )}
            >
              {day}
            </div>
          ))}

          {days.map((day) => {
            const isMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const dayBookings = getBookingsForDay(day);

            return (
               <div
                key={day.toISOString()}
                className={cn(
                  "flex flex-col bg-white overflow-hidden",
                  isExpanded ? "min-h-[120px] p-2 gap-1.5" : "min-h-[52px] p-1 gap-1",
                  !isMonth && "bg-neutral-50/50"
                )}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-colors shrink-0",
                    isExpanded ? "w-7 h-7 text-sm ml-auto" : "w-5 h-5 text-[10px] mx-auto",
                    today
                      ? "bg-primary text-white font-bold shadow-sm"
                      : isMonth
                      ? "text-neutral-700 font-medium hover:bg-neutral-100"
                      : "text-neutral-300"
                  )}
                >
                  {format(day, "d")}
                </div>

                {/* Indicator Badges */}
                <div className={cn("flex flex-col gap-1 w-full overflow-y-auto no-scrollbar", isExpanded ? "flex-1" : "")}>
                  {dayBookings.map((b, i) => {
                    const MAX_VISIBLE = isExpanded ? dayBookings.length : 2;

                    if (!isExpanded && i >= MAX_VISIBLE) {
                      if (i === MAX_VISIBLE && dayBookings.length > MAX_VISIBLE) {
                        return (
                          <div key="more" className="text-[8px] text-neutral-500 font-semibold text-center bg-neutral-100 rounded-sm py-0.5">
                            +{dayBookings.length - MAX_VISIBLE} more
                          </div>
                        );
                      }
                      if (i > MAX_VISIBLE) return null;
                    }
                    
                    let styles = "";
                    switch (b.status) {
                      case "PENDING": styles = "bg-amber-100 text-amber-800 border-amber-200"; break;
                      case "CONFIRMED": styles = "bg-blue-100 text-blue-800 border-blue-200"; break;
                      case "IN_PROGRESS": styles = "bg-indigo-100 text-indigo-800 border-indigo-200"; break;
                      case "COMPLETED": styles = "bg-emerald-100 text-emerald-800 border-emerald-200"; break;
                      default: styles = "bg-neutral-100 text-neutral-800 border-neutral-200"; break;
                    }

                    return (
                      <div
                        key={i}
                        className={cn(
                          "border rounded-sm truncate font-medium",
                          isExpanded ? "px-1.5 py-1 text-xs" : "px-1 py-px text-[9px]",
                          styles
                        )}
                        title={`${b.unitName} - ${b.status}`}
                      >
                        {b.unitName}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-neutral-400" />
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Booking Overview
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            title="Expand Calendar"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Mini Calendar Content */}
        <div className="p-5 flex-1 flex flex-col">
          {renderCalendarGrid(false)}
        </div>
      </div>

      {/* Expanded Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[85vw] md:max-w-[70vw] w-full h-[85vh] p-0 overflow-hidden flex flex-col bg-neutral-100 rounded-xl" aria-describedby="expanded-calendar-description">
          <DialogTitle className="sr-only">Fleet Booking Calendar</DialogTitle>
          <DialogDescription id="expanded-calendar-description" className="sr-only">
            A full-screen view of the monthly vehicle booking calendar.
          </DialogDescription>
          <div className="flex-1 overflow-hidden relative isolate z-0 bg-white max-h-full flex flex-col">
            {renderCalendarGrid(true)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
