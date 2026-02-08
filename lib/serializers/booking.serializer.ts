import { Booking } from "@/lib/generated/prisma";

export function serializeBooking(booking: any) {
  return {
    id: booking.id,
    unitId: booking.unitId,
    customerId: booking.customerId,
    startDate: booking.startDate instanceof Date ? booking.startDate.toISOString() : booking.startDate,
    endDate: booking.endDate instanceof Date ? booking.endDate.toISOString() : booking.endDate,
    pricePerDay: Number(booking.pricePerDay),
    totalPrice: Number(booking.totalPrice),
    status: booking.status,
    location: booking.location,
    metadata: booking.metadata,
    createdAt: booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
    updatedAt: booking.updatedAt instanceof Date ? booking.updatedAt.toISOString() : booking.updatedAt,
    createdById: booking.createdById,
  };
}

export function serializeBookings(bookings: Booking[]) {
  return bookings.map(serializeBooking);
}
