"use client";

import { useAllPayments } from "@/hooks";
import {
  Loader2,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import { cn } from "@/lib/utils";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  online_banking: "Online Banking",
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote size={16} />,
  bank_transfer: <Building2 size={16} />,
  online_banking: <Smartphone size={16} />,
};

const METHOD_BADGE_STYLES: Record<string, string> = {
  cash: "bg-emerald-50 text-emerald-700 border-emerald-200",
  bank_transfer: "bg-blue-50 text-blue-700 border-blue-200",
  online_banking: "bg-purple-50 text-purple-700 border-purple-200",
};

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(val);
}

export default function PaymentsPage() {
  const { data: result, isLoading, isError, error } = useAllPayments();

  const payments = result?.data || [];

  // Analytics
  const totalCollected = payments.reduce(
    (s: number, p: any) => s + p.amount,
    0,
  );

  const todayPayments = payments.filter((p: any) =>
    isToday(new Date(p.paidDate)),
  );
  const weekPayments = payments.filter((p: any) =>
    isThisWeek(new Date(p.paidDate), { weekStartsOn: 1 }),
  );
  const monthPayments = payments.filter((p: any) =>
    isThisMonth(new Date(p.paidDate)),
  );

  const todayTotal = todayPayments.reduce(
    (s: number, p: any) => s + p.amount,
    0,
  );
  const weekTotal = weekPayments.reduce((s: number, p: any) => s + p.amount, 0);
  const monthTotal = monthPayments.reduce(
    (s: number, p: any) => s + p.amount,
    0,
  );

  // Group by method
  const byMethod = payments.reduce(
    (acc: Record<string, { count: number; total: number }>, p: any) => {
      if (!acc[p.method]) acc[p.method] = { count: 0, total: 0 };
      acc[p.method].count++;
      acc[p.method].total += p.amount;
      return acc;
    },
    {},
  );

  const analyticsCards = [
    {
      label: "Total Collected",
      value: formatCurrency(totalCollected),
      sub: `${payments.length} payment${payments.length !== 1 ? "s" : ""}`,
      icon: <TrendingUp size={20} />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Today",
      value: formatCurrency(todayTotal),
      sub: `${todayPayments.length} payment${todayPayments.length !== 1 ? "s" : ""}`,
      icon: <Calendar size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "This Week",
      value: formatCurrency(weekTotal),
      sub: `${weekPayments.length} payment${weekPayments.length !== 1 ? "s" : ""}`,
      icon: <Calendar size={20} />,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "This Month",
      value: formatCurrency(monthTotal),
      sub: `${monthPayments.length} payment${monthPayments.length !== 1 ? "s" : ""}`,
      icon: <Calendar size={20} />,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Payments
          </h1>
        </div>
        <p className="text-neutral-500 text-sm">
          Track and review all recorded payments across bookings.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {analyticsCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-neutral-200 rounded-sm shadow-sm p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {card.label}
              </span>
              <div className={cn("p-2 rounded-sm", card.color)}>
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900 leading-none">
                {card.value}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Payment by Method sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <CreditCard size={16} className="text-neutral-900" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                By Method
              </h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {Object.keys(METHOD_LABELS).map((method) => {
                const data = byMethod[method] || { count: 0, total: 0 };
                return (
                  <div key={method} className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={cn(
                          "p-1.5 rounded-sm",
                          METHOD_BADGE_STYLES[method]?.replace(
                            "text-",
                            "text-",
                          ) || "bg-neutral-50 text-neutral-600",
                        )}
                      >
                        {METHOD_ICONS[method]}
                      </div>
                      <span className="text-sm font-semibold text-neutral-900">
                        {METHOD_LABELS[method]}
                      </span>
                    </div>
                    <p className="text-lg font-black text-neutral-900">
                      {formatCurrency(data.total)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {data.count} payment{data.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
              {Object.keys(byMethod).length === 0 && (
                <div className="px-5 py-8 text-center text-neutral-400 text-sm">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="lg:col-span-3">
          {isLoading && (
            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 font-medium animate-pulse">
                    Loading payments...
                  </p>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load payments. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (
            <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
                <CreditCard size={16} className="text-neutral-900" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  All Payments
                </h2>
                <span className="ml-auto text-[10px] font-bold text-neutral-400 uppercase">
                  {payments.length} records
                </span>
              </div>

              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-neutral-100 p-4 rounded-full mb-4">
                    <CreditCard size={24} className="text-neutral-400" />
                  </div>
                  <p className="text-base font-semibold text-neutral-500">
                    No payments recorded yet
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Payments will appear here once they are recorded on a
                    booking.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50/50">
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Booking / Customer
                        </th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {payments.map((payment: any) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-neutral-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-900 text-xs">
                                {format(
                                  new Date(payment.paidDate),
                                  "MMM dd, yyyy",
                                )}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {isToday(new Date(payment.paidDate))
                                  ? "Today"
                                  : isThisWeek(new Date(payment.paidDate), {
                                        weekStartsOn: 1,
                                      })
                                    ? "This week"
                                    : isThisMonth(new Date(payment.paidDate))
                                      ? "This month"
                                      : ""}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-900 text-xs">
                                {payment.unitName}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {payment.customerName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border",
                                METHOD_BADGE_STYLES[payment.method] ||
                                  "bg-neutral-50 text-neutral-600 border-neutral-200",
                              )}
                            >
                              {METHOD_ICONS[payment.method]}
                              {METHOD_LABELS[payment.method] || payment.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-neutral-500 font-mono">
                              {payment.referenceNumber || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-emerald-600">
                              {formatCurrency(payment.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
