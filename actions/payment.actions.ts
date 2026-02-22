"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordPaymentSchema, type RecordPaymentInput } from "@/lib/validations/payment.schema";
import { serializePayment, serializePayments } from "@/lib/serializers/payment.serializer";

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

    const { bookingId, amount, method, referenceNumber, paidDate, notes } =
      validationResult.data;

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
    const payments = await prisma.payment.findMany({
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
    const payment = await prisma.payment.delete({ where: { id } });

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
