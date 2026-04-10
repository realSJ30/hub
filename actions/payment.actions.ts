"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordPaymentSchema, updatePaymentSchema, type RecordPaymentInput, type UpdatePaymentInput } from "@/lib/validations/payment.schema";
import { serializePayment, serializePayments } from "@/lib/serializers/payment.serializer";
import { createClient } from "@/utils/supabase/server";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function recordPayment(data: RecordPaymentInput) {
  try {
    const validationResult = recordPaymentSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validationResult.error.flatten().fieldErrors,
      };
    }

    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { bookingId, amount, method, referenceNumber, paidDate, notes } =
      validationResult.data;

    // Verify the target booking belongs to the authenticated user before
    // recording a payment against it.
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, createdById: user.id },
    });

    if (!booking) {
      return { success: false, error: "Booking not found or unauthorized" };
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        method,
        referenceNumber: referenceNumber || null,
        paidDate,
        notes: notes || null,
      },
    });

    revalidatePath("/payments");
    revalidatePath("/bookings");
    revalidatePath(`/bookings/${bookingId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializePayment(payment),
    };
  } catch (error) {
    console.error("Error recording payment:", error);
    return {
      success: false,
      error: "Failed to record payment. Please try again.",
    };
  }
}

export async function getPaymentsForBooking(bookingId: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Confirm the booking belongs to this user before returning its payments.
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, createdById: user.id },
    });

    if (!booking) {
      return { success: false, error: "Booking not found or unauthorized" };
    }

    const payments = await prisma.payment.findMany({
      where: { bookingId },
      orderBy: { paidDate: "desc" },
    });

    return {
      success: true,
      data: serializePayments(payments),
    };
  } catch (error) {
    console.error("Error fetching booking payments:", error);
    return {
      success: false,
      error: "Failed to fetch payments for this booking.",
    };
  }
}

export async function getAllPayments() {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Scope payments to the current user by filtering through the booking
    // relation — Payment has no direct createdById, but every payment
    // belongs to a booking that does.
    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          createdById: user.id,
        },
      },
      include: {
        booking: {
          include: {
            customer: true,
            unit: true,
          },
        },
      },
      orderBy: { paidDate: "desc" },
    });

    return {
      success: true,
      data: payments.map((p) => ({
        ...serializePayment(p),
        bookingId: p.bookingId,
        customerName: p.booking.customer.fullName,
        unitName: p.booking.unit.name,
        totalPrice: Number(p.booking.totalPrice),
      })),
    };
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return {
      success: false,
      error: "Failed to fetch payments.",
    };
  }
}

export async function deletePayment(id: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Verify ownership through the booking relation before deleting.
    const payment = await prisma.payment.findFirst({
      where: {
        id,
        booking: { createdById: user.id },
      },
    });

    if (!payment) {
      return { success: false, error: "Payment not found or unauthorized" };
    }

    await prisma.payment.delete({ where: { id } });

    revalidatePath("/payments");
    revalidatePath("/bookings");
    revalidatePath(`/bookings/${payment.bookingId}`);

    return {
      success: true,
      data: serializePayment(payment),
    };
  } catch (error) {
    console.error("Error deleting payment:", error);
    return {
      success: false,
      error: "Failed to delete payment.",
    };
  }
}

export async function updatePayment(data: UpdatePaymentInput) {
  try {
    const validationResult = updatePaymentSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validationResult.error.flatten().fieldErrors,
      };
    }

    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { id, bookingId, amount, method, referenceNumber, paidDate, notes } =
      validationResult.data;

    // Verify ownership through the booking relation before updating.
    const existing = await prisma.payment.findFirst({
      where: {
        id,
        booking: { createdById: user.id },
      },
    });

    if (!existing) {
      return { success: false, error: "Payment not found or unauthorized" };
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        bookingId,
        amount,
        method,
        referenceNumber: referenceNumber || null,
        paidDate,
        notes: notes || null,
      },
    });

    revalidatePath("/payments");
    revalidatePath("/bookings");
    revalidatePath(`/bookings/${bookingId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializePayment(payment),
    };
  } catch (error) {
    console.error("Error updating payment:", error);
    return {
      success: false,
      error: "Failed to update payment.",
    };
  }
}
