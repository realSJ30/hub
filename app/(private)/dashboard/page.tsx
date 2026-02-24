import { createClient } from "@/utils/supabase/server";
import { getDashboardStats } from "@/actions/dashboard.actions";
import {
  BookOpen,
  Car,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  BarChart3,
} from "lucide-react";
import DashboardCard from "./components/dashboard-card";
import RevenueChart from "./components/revenue-chart";
import BookingStatusChart from "./components/booking-status-chart";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
  return `₱${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-neutral-50 text-neutral-500 border border-neutral-200",
  },
  NO_SHOW: {
    label: "No Show",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
};

const shortcuts = [
  {
    label: "Bookings",
    description: "Manage all rental bookings",
    href: "/bookings",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverBorder: "hover:border-blue-200",
  },
  {
    label: "Units",
    description: "View and manage fleet",
    href: "/units",
    icon: Car,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    hoverBorder: "hover:border-violet-200",
  },
  {
    label: "Payments",
    description: "Track payment records",
    href: "/payments",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    hoverBorder: "hover:border-emerald-200",
  },
];

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = await getDashboardStats();

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
            Dashboard
          </h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            Welcome back, {user?.email?.split("@")[0]}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm text-sm">
            {user?.email?.[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* ─── Analytics Cards ─── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-neutral-400" />
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Overview
          </h2>
        </div>

        {/* Row 1: 3 booking metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <DashboardCard
            label="Total Bookings"
            value={stats.totalBookings.toString()}
            trend={`${stats.totalUnits} units in fleet`}
            icon={BookOpen}
            href="/bookings"
          />
          <DashboardCard
            label="Active & Upcoming"
            value={stats.activeBookings.toString()}
            trend={stats.activeBookings > 0 ? "Needs attention" : "All clear"}
            trendClassName={
              stats.activeBookings > 0 ? "bg-blue-50 text-blue-600" : undefined
            }
            icon={Clock}
            href="/bookings"
          />
          <DashboardCard
            label="Completed"
            value={stats.completedBookings.toString()}
            trend={`${stats.cancelledBookings} cancelled`}
            trendClassName="bg-neutral-100 text-neutral-500"
            icon={CheckCircle2}
            href="/bookings"
          />
        </div>

        {/* Row 2: 2 financial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DashboardCard
            label="Revenue Collected"
            value={formatCurrency(stats.totalCollected)}
            trend={`of ${formatCurrency(stats.totalRevenue)} total`}
            className="bg-primary border-primary"
            icon={Banknote}
            href="/payments"
          />
          <DashboardCard
            label="Outstanding Balance"
            value={formatCurrency(stats.outstandingBalance)}
            trend={
              stats.outstandingBalance > 0
                ? "Pending collection"
                : "Fully collected"
            }
            trendClassName={
              stats.outstandingBalance > 0
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600"
            }
            icon={CircleDollarSign}
            href="/payments"
          />
        </div>
      </section>

      {/* ─── Charts Section ─── */}
      <section className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue bar chart — 2/3 width */}
          <div className="lg:col-span-2">
            <RevenueChart data={stats.monthlyData} />
          </div>
          {/* Booking status donut chart — 1/3 width */}
          <div className="lg:col-span-1">
            <BookingStatusChart
              data={stats.statusBreakdown}
              totalBookings={stats.totalBookings}
            />
          </div>
        </div>
      </section>

      {/* ─── Bottom Section: Quick Access + Recent Bookings ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Quick Access */}
        <section className="xl:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-neutral-400" />
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Quick Access
            </h2>
          </div>

          <div className="space-y-2.5">
            {shortcuts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 bg-white p-4 rounded-md border border-neutral-200 shadow-sm transition-all duration-200 hover:shadow-md group",
                  item.hoverBorder,
                )}
              >
                <div
                  className={cn(
                    "p-2.5 rounded-md shrink-0 transition-transform duration-200 group-hover:scale-110",
                    item.bgColor,
                  )}
                >
                  <item.icon size={20} className={item.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-neutral-500">{item.description}</p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0"
                />
              </Link>
            ))}
          </div>

          {/* Fleet Summary Mini-Card */}
          <div className="mt-2.5 bg-white p-4 rounded-md border border-neutral-200 shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-3">
              Fleet Status
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-neutral-500">Operational</span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {stats.operationalUnits} / {stats.totalUnits}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{
                      width: `${stats.totalUnits > 0 ? (stats.operationalUnits / stats.totalUnits) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck size={16} className="text-neutral-400" />
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Recent Bookings
              </h2>
            </div>
            <Link
              href="/bookings"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
            {stats.recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/5 p-3 rounded-full mb-3">
                  <BookOpen size={28} className="text-primary/30" />
                </div>
                <p className="text-sm font-medium text-neutral-600">
                  No bookings yet
                </p>
                <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
                  Create your first booking to see activity here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {stats.recentBookings.map((booking) => {
                  const config =
                    statusConfig[booking.status] || statusConfig.PENDING;
                  const isPaid = booking.totalPaid >= booking.totalPrice;

                  return (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/80 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {booking.customerName}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                              config.className,
                            )}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {booking.unitName} &middot;{" "}
                          {formatDate(booking.startDate)} –{" "}
                          {formatDate(booking.endDate)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-neutral-900">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                        <p
                          className={cn(
                            "text-[10px] font-medium",
                            isPaid ? "text-emerald-600" : "text-amber-600",
                          )}
                        >
                          {isPaid
                            ? "Fully paid"
                            : `₱${(booking.totalPrice - booking.totalPaid).toLocaleString()} due`}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
