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
        startDate: true,
        endDate: true,
      },
    });

    return {
      success: true,
      data: bookings.map(b => ({
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
