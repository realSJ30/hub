import { NextResponse } from "next/server";
import { z } from "zod";
import { updateBookingStatus } from "@/lib/booking-service";
import { BookingStatus } from "@/lib/generated/prisma";
import { bookingStatusEnum } from "@/lib/validations/booking.schema";

const updateBookingStatusSchema = z.object({
  bookingId: z.string().uuid("Invalid bookingId provided"),
  status: bookingStatusEnum,
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate inputs
    const validated = updateBookingStatusSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { 
          message: "Invalid payload provided", 
          errors: validated.error.errors.map(e => e.message) 
        }, 
        { status: 400 }
      );
    }

    const { bookingId, status } = validated.data;

    // Perform update
    const updatedBooking = await updateBookingStatus(
      bookingId, 
      status as BookingStatus
    );

    return NextResponse.json(
      { 
        message: "Booking status updated successfully", 
        booking: {
          id: updatedBooking.id,
          status: updatedBooking.status
        }
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error updating booking status:", error);
    
    if (error.message && error.message.includes("not found")) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { message: "An error occurred while updating the booking status" }, 
      { status: 500 }
    );
  }
}
