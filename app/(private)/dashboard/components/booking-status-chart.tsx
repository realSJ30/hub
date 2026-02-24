"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { BookingStatusBreakdown } from "@/actions/dashboard.actions";

interface BookingStatusChartProps {
  data: BookingStatusBreakdown[];
  totalBookings: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="bg-white border border-neutral-200 rounded-md shadow-lg p-3 text-xs">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: entry.payload.color }}
        />
        <span className="font-semibold text-neutral-800">{entry.name}</span>
      </div>
      <p className="text-neutral-500 mt-1">
        {entry.value} booking{entry.value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function BookingStatusChart({
  data,
  totalBookings,
}: BookingStatusChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-md border border-neutral-200 shadow-sm p-5 flex flex-col items-center justify-center h-full min-h-[340px]">
        <p className="text-sm text-neutral-400">No booking data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-neutral-200 shadow-sm p-5  flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-800">
          Booking Status
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Distribution by status
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-neutral-900">
              {totalBookings}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              Total
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-neutral-500 truncate">
              {item.name}
            </span>
            <span className="text-xs font-semibold text-neutral-800 ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
