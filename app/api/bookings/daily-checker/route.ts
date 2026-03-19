import { NextResponse } from "next/server";
import { endOfToday } from "date-fns";
import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "@/lib/booking-service";
import { BookingStatus } from "@/lib/generated/prisma";

export async function GET(req: Request) {
  try {
    // 1. Authorization check for Cron Job (optional but recommended)
    // Vercel Cron jobs can be protected using the CRON_SECRET environment variable.
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // For now, we'll log it but we might want to return 401 in production
      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      console.warn("Cron job called without proper CRON_SECRET authorization");
    }

    // 2. Query all bookings that should be "in_progress"
    // Requirement: start date is today or earlier, ignoring time (compare by date only).
    // Using endOfToday() includes all bookings starting anytime today or in the past.
    const todayEnd = endOfToday();

    const bookingsToUpdate = await prisma.booking.findMany({
      where: {
        startDate: {
          lte: todayEnd,
        },
        status: {
          notIn: [
            "IN_PROGRESS", 
            "COMPLETED", 
            "CANCELLED"
          ] as BookingStatus[],
        },
      },
    });

    const results = {
      totalFound: bookingsToUpdate.length,
      updated: 0,
      errors: 0,
      details: [] as any[],
    };

    // 3. For each booking, set status to "in_progress"
    // We use the shared updateBookingStatus logic for consistency.
    for (const booking of bookingsToUpdate) {
      try {
        await updateBookingStatus(booking.id, "IN_PROGRESS");
        results.updated++;
        results.details.push({ id: booking.id, success: true });
      } catch (err: any) {
        results.errors++;
        results.details.push({ id: booking.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({
      message: `Daily booking check completed. Updated ${results.updated} bookings to IN_PROGRESS.`,
      summary: results,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Daily Booking Checker Error:", error);
    return NextResponse.json(
      { message: "Internal server error during daily check" }, 
      { status: 500 }
    );
  }
}
