// Dummy Customers
export const CUSTOMERS_MOCK_DATA = [
  {
    id: "cust_001",
    fullName: "John Doe",
    phone: "+639171234567",
    email: "john.doe@example.com",
    createdAt: new Date("2026-02-01T10:00:00Z"),
    updatedAt: new Date("2026-02-01T10:00:00Z"),
  },
  {
    id: "cust_002",
    fullName: "Jane Smith",
    phone: "+639189876543",
    email: null, // optional email
    createdAt: new Date("2026-02-02T12:00:00Z"),
    updatedAt: new Date("2026-02-02T12:00:00Z"),
  },
];

// Dummy Bookings
export const BOOKINGS_MOCK_DATA = [
  {
    id: "booking_001",
    unitId: "unit_001",
    customerId: "cust_001",
    startDate: new Date("2026-03-01T08:00:00Z"),
    endDate: new Date("2026-03-05T18:00:00Z"),
    pricePerDay: 3500,
    totalPrice: 3500 * 5, // 5 days
    location: "Manila, Philippines",
    status: "CONFIRMED",
    metadata: JSON.stringify({ notes: "Customer requested child seats" }),
    createdAt: new Date("2026-02-05T09:00:00Z"),
    updatedAt: new Date("2026-02-05T09:00:00Z"),
    createdById: "user_001",
  },
  {
    id: "booking_002",
    unitId: "unit_002",
    customerId: "cust_002",
    startDate: new Date("2026-03-10T09:00:00Z"),
    endDate: new Date("2026-03-12T17:00:00Z"),
    pricePerDay: 3200,
    totalPrice: 3200 * 3, // 3 days
    location: "Cebu, Philippines",
    status: "PENDING",
    metadata: JSON.stringify({ notes: "VIP customer" }),
    createdAt: new Date("2026-02-06T11:00:00Z"),
    updatedAt: new Date("2026-02-06T11:00:00Z"),
    createdById: "user_001",
  },
];