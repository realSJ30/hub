"use server";

import { prisma } from "@/lib/prisma";

export interface MonthlyDataPoint {
  month: string;
  revenue: number;
  collected: number;
  bookings: number;
}

export interface BookingStatusBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalCollected: number;
  outstandingBalance: number;
  totalUnits: number;
  availableUnits: number;
  monthlyData: MonthlyDataPoint[];
  statusBreakdown: BookingStatusBreakdown[];
  recentBookings: {
    id: string;
    customerName: string;
    unitName: string;
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
    totalPaid: number;
  }[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  IN_PROGRESS: "#8b5cf6",
  COMPLETED: "#10b981",
  CANCELLED: "#6b7280",
  NO_SHOW: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();

  // Fetch all bookings with relations in a single query
  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
      unit: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch unit counts
  const totalUnits = await prisma.unit.count();
  const availableUnits = await prisma.unit.count({
    where: { status: "AVAILABLE" },
  });

  const totalBookings = bookings.length;

  // Active = CONFIRMED or IN_PROGRESS or PENDING with endDate in the future
  const activeBookings = bookings.filter(
    (b) =>
      ["CONFIRMED", "IN_PROGRESS", "PENDING"].includes(b.status) &&
      new Date(b.endDate) >= now
  ).length;

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const cancelledBookings = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;

  // Total revenue = sum of totalPrice for non-cancelled bookings
  const totalRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  // Total collected = sum of all payment amounts
  const totalCollected = bookings.reduce(
    (sum, b) =>
      sum + b.payments.reduce((pSum, p) => pSum + Number(p.amount), 0),
    0
  );

  const outstandingBalance = totalRevenue - totalCollected;

  // ── Monthly revenue/bookings data (last 6 months) ──
  const monthlyData: MonthlyDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;

    const monthBookings = bookings.filter((b) => {
      const start = new Date(b.startDate);
      return (
        start >= monthStart &&
        start <= monthEnd &&
        b.status !== "CANCELLED"
      );
    });

    const revenue = monthBookings.reduce(
      (sum, b) => sum + Number(b.totalPrice),
      0
    );

    const collected = monthBookings.reduce(
      (sum, b) =>
        sum + b.payments.reduce((pSum, p) => pSum + Number(p.amount), 0),
      0
    );

    monthlyData.push({
      month: label,
      revenue,
      collected,
      bookings: monthBookings.length,
    });
  }

  // ── Status Breakdown (for pie/donut chart) ──
  const statusCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });

  const statusBreakdown: BookingStatusBreakdown[] = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || "#6b7280",
    }));

  // Recent bookings (last 5)
  const recentBookings = bookings.slice(0, 5).map((b) => ({
    id: b.id,
    customerName: b.customer.fullName,
    unitName: b.unit.name,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    status: b.status,
    totalPrice: Number(b.totalPrice),
    totalPaid: b.payments.reduce((sum, p) => sum + Number(p.amount), 0),
  }));

  return {
    totalBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
    totalCollected,
    outstandingBalance,
    totalUnits,
    availableUnits,
    monthlyData,
    statusBreakdown,
    recentBookings,
  };
}
