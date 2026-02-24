"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyDataPoint } from "@/actions/dashboard.actions";

interface RevenueChartProps {
  data: MonthlyDataPoint[];
}

const formatCurrency = (value: number) =>
  `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-md shadow-lg p-3 text-xs">
      <p className="font-semibold text-neutral-700 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-neutral-500">{entry.name}:</span>
          <span className="font-semibold text-neutral-800">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-md border border-neutral-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">
            Revenue Overview
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Last 6 months</p>
        </div>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="collected"
              name="Collected"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
