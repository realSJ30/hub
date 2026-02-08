import { Customer } from "@/lib/generated/prisma";

export function serializeCustomer(customer: any) {
  return {
    id: customer.id,
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    createdAt: customer.createdAt instanceof Date ? customer.createdAt.toISOString() : customer.createdAt,
    updatedAt: customer.updatedAt instanceof Date ? customer.updatedAt.toISOString() : customer.updatedAt,
  };
}

export function serializeCustomers(customers: Customer[]) {
  return customers.map(serializeCustomer);
}
