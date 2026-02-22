"use client";

import { useAllPayments } from "@/hooks";
import {
  Loader2,
  AlertCircle,
  List,
  Layers,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  SmartphoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { DataTable } from "../bookings/data-table";
import { columns, type Payment } from "./columns";
import { groupedColumns, type GroupedBookingPayment } from "./grouped-columns";
import { DeletePaymentDialog } from "./components/delete-payment-dialog";
import { EditPaymentSheet } from "./components/edit-payment-sheet";
import { useRouter } from "next/navigation";
import { RecordPaymentSheet } from "../bookings/components/record-payment-sheet";
import { PaymentAnalytics } from "./components/payment-analytics";

function derivePaymentStatus(totalPrice: number, totalPaid: number) {
  if (totalPaid <= 0)
    return { label: "Unpaid", styles: "bg-red-50 text-red-700 border-red-200" };
  if (totalPaid > totalPrice)
    return {
      label: "Overpaid",
      styles: "bg-amber-50 text-amber-700 border-amber-200",
    };
  if (totalPaid === totalPrice)
    return {
      label: "Paid",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  return {
    label: "Partially Paid",
    styles: "bg-amber-50 text-amber-700 border-amber-200",
  };
}

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  online_banking: "Online Banking",
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote size={16} />,
  online_banking: <Smartphone size={16} />,
};

const METHOD_BADGE_STYLES: Record<string, string> = {
  cash: "bg-emerald-50 text-emerald-700 border-emerald-200",
  online_banking: "bg-purple-50 text-purple-700 border-purple-200",
};

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(val);
}

export default function PaymentsPage() {
  const router = useRouter();
  const { data: result, isLoading, isError, error } = useAllPayments();

  const [viewType, setViewType] = useState<"flat" | "grouped">("flat");
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // For Record Payment from grouped view
  const [isRecordSheetOpen, setIsRecordSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const payments = result?.data || [];

  const handleEdit = (payment: Payment) => {
    setPaymentToEdit(payment);
    setIsEditOpen(true);
  };

  const handleDelete = (payment: Payment) => {
    setPaymentToDelete(payment);
    setIsDeleteOpen(true);
  };

  const handleViewDetails = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  const handleRecordPayment = (group: GroupedBookingPayment) => {
    setSelectedBooking(group);
    setIsRecordSheetOpen(true);
  };

  // Grouped logic
  const groupedPayments = useMemo(() => {
    const groups: Record<string, GroupedBookingPayment> = {};

    payments.forEach((p: any) => {
      if (!groups[p.bookingId]) {
        groups[p.bookingId] = {
          bookingId: p.bookingId,
          customerName: p.customerName || "Unknown",
          unitName: p.unitName || "Unknown",
          totalPrice: p.totalPrice || 0,
          totalPaid: 0,
          remaining: 0,
          paymentStatus: { label: "", styles: "" },
          lastPaymentDate: new Date(p.paidDate),
          payments: [],
        };
      }
      groups[p.bookingId].totalPaid += p.amount;
      groups[p.bookingId].payments.push(p);

      const pDate = new Date(p.paidDate);
      if (pDate > groups[p.bookingId].lastPaymentDate) {
        groups[p.bookingId].lastPaymentDate = pDate;
      }
    });

    return Object.values(groups)
      .map((group) => {
        const remaining = group.totalPrice - group.totalPaid;
        return {
          ...group,
          remaining,
          paymentStatus: derivePaymentStatus(group.totalPrice, group.totalPaid),
        };
      })
      .sort(
        (a, b) => b.lastPaymentDate.getTime() - a.lastPaymentDate.getTime(),
      );
  }, [payments]);

  // Analytics helper
  const totals = useMemo(() => {
    const collected = payments.reduce((s: number, p: any) => s + p.amount, 0);
    const today = payments
      .filter((p: any) => isToday(new Date(p.paidDate)))
      .reduce((s, p: any) => s + p.amount, 0);

    const totalOwed = groupedPayments.reduce((s, g) => s + g.totalPrice, 0);
    const outstanding = Math.max(totalOwed - collected, 0);

    const fullyPaidCount = groupedPayments.filter(
      (g) => g.totalPaid >= g.totalPrice,
    ).length;

    return {
      collected,
      today,
      outstanding,
      totalOwed,
      fullyPaidCount,
      bookingCount: groupedPayments.length,
    };
  }, [payments, groupedPayments]);

  return (
    <main className="min-h-screen bg-neutral-50/30">
      <div className="container mx-auto py-10 px-6 max-w-[1400px]">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
            Payment Management
          </h1>
          <p className="text-neutral-500 font-medium">
            Monitor revenue flow, analyze payment statuses, and manage
            transaction records.
          </p>
        </div>

        {/* Analytics Section */}
        <PaymentAnalytics
          payments={payments}
          groupedPayments={groupedPayments}
          totals={totals}
        />

        {/* Payment Records Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Payment Records
            </h2>

            {/* View Toggles */}
            <div className="flex p-1 bg-neutral-200/50 rounded-sm border border-neutral-200 h-fit">
              <button
                onClick={() => setViewType("flat")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-sm transition-all",
                  viewType === "flat"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50",
                )}
              >
                <List size={14} />
                Transaction History
              </button>
              <button
                onClick={() => setViewType("grouped")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-sm transition-all",
                  viewType === "grouped"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50",
                )}
              >
                <Layers size={14} />
                By Booking
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm h-96 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-500 font-medium animate-pulse uppercase tracking-widest">
                  Fetching data...
                </p>
              </div>
            </div>
          )}

          {isError && (
            <Alert
              variant="destructive"
              className="rounded-sm shadow-sm ring-1 ring-red-100 border-none"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">System Error</AlertTitle>
              <AlertDescription className="text-xs">
                {error instanceof Error
                  ? error.message
                  : "Database connection failed."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {payments.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-sm shadow-sm py-20 flex flex-col items-center justify-center text-center">
                  <div className="bg-neutral-100 p-4 rounded-full mb-4">
                    <List size={32} className="text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    No records found
                  </h3>
                  <p className="text-neutral-500 text-sm max-w-xs mt-1">
                    Payments will automatically appear here once recorded
                    against bookings.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {viewType === "flat" ? (
                        <List size={16} />
                      ) : (
                        <Layers size={16} />
                      )}
                      <h2 className="font-bold text-[10px] uppercase tracking-widest text-neutral-900">
                        {viewType === "flat"
                          ? "All Individual Payments"
                          : "Grouped Receivables"}
                      </h2>
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase bg-neutral-100 px-2 py-0.5 rounded-sm">
                      {viewType === "flat"
                        ? payments.length
                        : groupedPayments.length}{" "}
                      {viewType === "flat" ? "RECORDS" : "BOOKINGS"}
                    </span>
                  </div>
                  {viewType === "flat" ? (
                    <DataTable
                      columns={columns}
                      data={payments}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      className="rounded-none"
                    />
                  ) : (
                    <DataTable
                      columns={groupedColumns}
                      data={groupedPayments}
                      onViewDetails={handleViewDetails}
                      onRecordPayment={handleRecordPayment}
                      className="rounded-none"
                      renderSubComponent={({ row }) => (
                        <div className="p-4 bg-neutral-50/50 space-y-3">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2">
                            Payment History
                          </div>
                          <div className="grid gap-2">
                            {row.original.payments.map((payment: any) => (
                              <div
                                key={payment.id}
                                className="bg-white border border-neutral-200 rounded-sm p-3 flex items-center justify-between group/pay"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-50 p-2 rounded-sm text-blue-600">
                                    {METHOD_ICONS[payment.method] || (
                                      <CreditCard size={14} />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-neutral-900 line-clamp-1">
                                      {payment.referenceNumber ||
                                        "Untracked Reference"}
                                    </div>
                                    <div className="text-[10px] text-neutral-500">
                                      {format(
                                        new Date(payment.paidDate),
                                        "MMM dd, yyyy",
                                      )}{" "}
                                      • {METHOD_LABELS[payment.method]}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm font-black text-emerald-600">
                                    {formatCurrency(payment.amount)}
                                  </span>
                                  <div className="flex items-center gap-1 opacity-0 group-hover/pay:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-neutral-400 hover:text-neutral-900"
                                      onClick={() => handleEdit(payment)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => handleDelete(payment)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EditPaymentSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        payment={paymentToEdit}
      />

      <DeletePaymentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        payment={paymentToDelete}
      />

      <RecordPaymentSheet
        open={isRecordSheetOpen}
        onOpenChange={setIsRecordSheetOpen}
        bookingId={selectedBooking?.bookingId || ""}
        bookingTotal={selectedBooking?.totalPrice || 0}
        totalPaid={selectedBooking?.totalPaid || 0}
      />
    </main>
  );
}
