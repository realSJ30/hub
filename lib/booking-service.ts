import { prisma } from "./prisma";
import { BookingStatus } from "./generated/prisma";

/**
 * Updates a booking's status with basic validation.
 * Avoids updating if already in a "final" or redundant status.
 */
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true },
  });

  if (!existingBooking) {
    throw new Error(`Booking with ID ${bookingId} not found.`);
  }

  // Already in the target status, skip update
  if (existingBooking.status === status) {
    return existingBooking;
  }

  // Requirements: Avoid updating if already in_progress, completed, or cancelled
  // IF the goal is specifically to update to "IN_PROGRESS" in the cron
  // We should be careful about this check if the API is general-purpose.
  // But the prompt says "Avoid updating bookings that are already: in_progress, completed, cancelled".
  // This probably refers to the cron logic, but the API should also ideally respect it
  // or handle transitions safely.
  
  const FINAL_STATUSES: BookingStatus[] = ["IN_PROGRESS", "COMPLETED", "CANCELLED"];
  
  if (FINAL_STATUSES.includes(existingBooking.status)) {
    // If it's already in one of these, we might not want to change it (e.g., from Completed back to Pending)
    // However, the rule "Avoid updating bookings that are already: in_progress, completed, cancelled" 
    // is specified in the context of the automation.
    // For a general API, we might allow manual overrides, but let's stick to the spirit of the prompt.
    // We'll skip if it's already 'terminal' for the purpose of the cron.
    return existingBooking; 
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
}
