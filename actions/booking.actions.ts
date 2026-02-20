"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations/booking.schema";
import { createClient } from "@/utils/supabase/server";
import { serializeBooking, serializeBookings } from "@/lib/serializers/booking.serializer";

export async function createBooking(data: CreateBookingInput) {
  try {
    const validationResult = createBookingSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validationResult.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check for overlapping bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        unitId: validationResult.data.unitId,
        status: {
          in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
        },
        AND: [
          { startDate: { lt: validationResult.data.endDate } },
          { endDate: { gt: validationResult.data.startDate } },
        ],
      },
    });

    if (conflictingBooking) {
      return {
        success: false,
        error: "Booking Conflict",
        details: {
          startDate: ["The selected date range overlaps with an existing booking."],
          endDate: ["The selected date range overlaps with an existing booking."],
        },
      };
    }

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        unitId: validationResult.data.unitId,
        customerId: validationResult.data.customerId,
        startDate: validationResult.data.startDate,
        endDate: validationResult.data.endDate,
        pricePerDay: validationResult.data.pricePerDay,
        totalPrice: validationResult.data.totalPrice,
        location: validationResult.data.location || null,
        status: validationResult.data.status as any,
        metadata: validationResult.data.metadata || null,
        createdById: user.id,
      },
    });

    revalidatePath("/bookings");
    revalidatePath("/units");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeBooking(booking),
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    };
  }
}

export async function updateBooking(id: string, data: CreateBookingInput) {
  try {
    const validationResult = createBookingSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validationResult.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check for overlapping bookings (excluding current booking)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        unitId: validationResult.data.unitId,
        id: { not: id },
        status: {
          in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
        },
        AND: [
          { startDate: { lt: validationResult.data.endDate } },
          { endDate: { gt: validationResult.data.startDate } },
        ],
      },
    });

    if (conflictingBooking) {
      return {
        success: false,
        error: "Booking Conflict",
        details: {
          startDate: ["The selected date range overlaps with an existing booking."],
          endDate: ["The selected date range overlaps with an existing booking."],
        },
      };
    }

    // Update Booking
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        unitId: validationResult.data.unitId,
        customerId: validationResult.data.customerId,
        startDate: validationResult.data.startDate,
        endDate: validationResult.data.endDate,
        pricePerDay: validationResult.data.pricePerDay,
        totalPrice: validationResult.data.totalPrice,
        location: validationResult.data.location || null,
        status: validationResult.data.status as any,
        metadata: validationResult.data.metadata || null,
      },
    });

    revalidatePath("/bookings");
    revalidatePath("/units");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeBooking(booking),
    };
  } catch (error) {
    console.error("Error updating booking:", error);
    return {
      success: false,
      error: "Failed to update booking. Please try again.",
    };
  }
}

export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        unit: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: bookings.map(b => ({
        ...serializeBooking(b),
        customerName: b.customer.fullName,
        customerEmail: b.customer.email,
        customerPhone: b.customer.phone,
        unitName: b.unit.name,
      })),
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      error: "Failed to fetch bookings.",
    };
  }
}

export async function getBookingsByUnit(unitId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        unitId,
      },
      include: {
        customer: true,
        unit: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return {
      success: true,
      data: bookings.map(b => ({
        ...serializeBooking(b),
        customerName: b.customer.fullName,
        customerEmail: b.customer.email,
        customerPhone: b.customer.phone,
        unitName: b.unit.name,
      })),
    };
  } catch (error) {
    console.error("Error fetching unit bookings:", error);
    return {
      success: false,
      error: "Failed to fetch booking history for this unit.",
    };
  }
}

export async function getUnitAvailability(unitId: string) {
  try {
    if (!unitId) {
      return { success: false, error: "Unit ID is required" };
    }

    const bookings = await prisma.booking.findMany({
      where: {
        unitId,
        status: {
          in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
        },
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
      },
    });

    return {
      success: true,
      data: bookings.map(b => ({
        id: b.id,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching unit availability:", error);
    return {
      success: false,
      error: "Failed to fetch unit availability.",
    };
  }
}

export async function getBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        unit: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    return {
      success: true,
      data: {
        ...serializeBooking(booking),
        customerName: booking.customer.fullName,
        customerEmail: booking.customer.email,
        customerPhone: booking.customer.phone,
        unitName: booking.unit.name,
        unitBrand: booking.unit.brand,
      },
    };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return {
      success: false,
      error: "Failed to fetch booking details.",
    };
  }
}

export async function deleteBooking(id: string) {
  try {
    const booking = await prisma.booking.delete({
      where: { id },
    });

    revalidatePath("/bookings");
    revalidatePath("/units");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeBooking(booking),
    };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return {
      success: false,
      error: "Failed to delete booking. Please try again.",
    };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: status as any },
    });

    revalidatePath("/bookings");
    revalidatePath(`/bookings/${id}`);
    revalidatePath("/units");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeBooking(booking),
    };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      error: "Failed to update booking status.",
    };
  }
}
