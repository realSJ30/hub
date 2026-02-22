"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,  
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CircleDollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  format,
  startOfDay,
  subDays,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

interface PaymentAnalyticsProps {
  payments: any[];
  groupedPayments: any[];
  totals: {
    collected: number;
    today: number;
    outstanding: number;
    totalOwed: number;
    fullyPaidCount: number;
    bookingCount: number;
  };
}

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

export function PaymentAnalytics({
  payments,
  groupedPayments,
  totals,
}: PaymentAnalyticsProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val);

  // Revenue Trend (Last 7 Days)
  const chartData = useMemo(() => {
    const end = startOfDay(new Date());
    const start = subDays(end, 6);
    const interval = eachDayOfInterval({ start, end });

    return interval.map((day) => {
      const dayPayments = payments.filter((p) =>
        isSameDay(new Date(p.paidDate), day),
      );
      const amount = dayPayments.reduce((s, p) => s + p.amount, 0);
      return {
        name: format(day, "EEE"),
        amount,
      };
    });
  }, [payments]);

  // Status Breakdown
  const statusBreakdown = useMemo(() => {
    const counts = {
      Paid: 0,
      "Partially Paid": 0,
      Unpaid: 0,
      Overpaid: 0,
    };

    groupedPayments.forEach((g) => {
      const label = g.paymentStatus.label as keyof typeof counts;
      if (counts[label] !== undefined) {
        counts[label]++;
      }
    });

    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [groupedPayments]);

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Total Revenue
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-neutral-900">
              {formatCurrency(totals.collected)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              From {totals.bookingCount} active bookings
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Collections Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-neutral-900">
              {formatCurrency(totals.today)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Recorded in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Pending Dues
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600">
              {formatCurrency(totals.outstanding)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Still uncollected balance
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Collection Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-neutral-900">
              {totals.totalOwed > 0
                ? Math.round((totals.collected / totals.totalOwed) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {totals.fullyPaidCount} settled bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              Revenue Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Daily payment collections for the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#a3a3a3" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#a3a3a3" }}
                    tickFormatter={(value) =>
                      `₱${value >= 1000 ? value / 1000 + "k" : value}`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "4px",
                      border: "1px solid #e5e5e5",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    formatter={(value: number | undefined) => [
                      value !== undefined ? formatCurrency(value) : "₱0.00",
                      "Collected",
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-neutral-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <CheckCircle size={16} className="text-blue-500" />
              Payment Status
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of booking settlement levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "4px",
                      border: "1px solid #e5e5e5",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value, entry: any) => (
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">
                        {value} ({entry.payload.value})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
