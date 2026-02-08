import { Customer } from "@/lib/generated/prisma";

export function serializeCustomer(customer: Customer) {
  return {
    ...customer,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

export function serializeCustomers(customers: Customer[]) {
  return customers.map(serializeCustomer);
}
