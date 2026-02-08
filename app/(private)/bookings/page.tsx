"use client";

import { BookingsTableHeader } from "./components/bookings-table-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  BOOKINGS_MOCK_DATA,
  CUSTOMERS_MOCK_DATA,
} from "@/utils/constants/mock";

const BookingsPage = () => {
  // Map mock data and lookup customer details for display
  const data = BOOKINGS_MOCK_DATA.map((booking) => {
    const customer = CUSTOMERS_MOCK_DATA.find(
      (c) => c.id === booking.customerId,
    );
    return {
      ...booking,
      customerName: customer?.fullName,
      customerEmail: customer?.email,
    };
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <BookingsTableHeader />

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default BookingsPage;
