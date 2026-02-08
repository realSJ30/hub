import { Booking } from "@/lib/generated/prisma";

export function serializeBooking(booking: Booking) {
  return {
    ...booking,
    pricePerDay: Number(booking.pricePerDay),
    totalPrice: Number(booking.totalPrice),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
  };
}

export function serializeBookings(bookings: Booking[]) {
  return bookings.map(serializeBooking);
}
