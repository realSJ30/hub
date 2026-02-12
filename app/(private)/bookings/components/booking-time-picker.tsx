"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, setHours, setMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingTimePickerProps {
  label: string;
  date: Date | undefined;
  onTimeChange: (newDate: Date | undefined) => void;
  isTimeSelected?: boolean;
  disabledHours?: number[];
}

export function BookingTimePicker({
  label,
  date,
  onTimeChange,
  isTimeSelected = false,
  disabledHours = [],
}: BookingTimePickerProps) {
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const d = setHours(startOfDay(new Date()), i);
      options.push({
        value: i.toString(),
        label: format(d, "hh:00 a"),
      });
    }
    return options;
  }, []);

  const currentHour =
    date && isTimeSelected ? date.getHours().toString() : undefined;

  return (
    <div className="space-y-2 flex-1">
      <Label className="text-xs font-semibold">{label}</Label>
      <Select
        value={currentHour}
        onValueChange={(val) => {
          if (!date) return;
          const newDate = setHours(
            setMinutes(new Date(date), 0),
            parseInt(val),
          );
          onTimeChange(newDate);
        }}
        disabled={!date}
      >
        <SelectTrigger className="h-10 rounded-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-400" />
            <SelectValue placeholder="Choose time" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={disabledHours.includes(parseInt(option.value))}
            >
              <span
                className={cn(
                  disabledHours.includes(parseInt(option.value)) &&
                    "line-through opacity-50",
                )}
              >
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
