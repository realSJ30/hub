"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createCustomerSchema, type CreateCustomerInput } from "@/lib/validations/customer.schema";
import { createClient } from "@/utils/supabase/server";
import { serializeCustomer, serializeCustomers } from "@/lib/serializers/customer.serializer";

export async function upsertCustomer(data: CreateCustomerInput) {
  try {
    const validationResult = createCustomerSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid customer data",
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

    let customer;
    if (validationResult.data.email) {
      customer = await prisma.customer.findUnique({
        where: { email: validationResult.data.email },
      });
    }

    if (customer) {
      // Update existing customer if needed (or just return existing)
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          fullName: validationResult.data.fullName,
          phone: validationResult.data.phone,
        },
      });
    } else {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          fullName: validationResult.data.fullName,
          phone: validationResult.data.phone,
          email: validationResult.data.email || null,
        },
      });
    }

    revalidatePath("/bookings");
    return {
      success: true,
      data: serializeCustomer(customer),
    };
  } catch (error) {
    console.error("Error upserting customer:", error);
    return {
      success: false,
      error: "Failed to handle customer information.",
    };
  }
}

export async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        fullName: "asc",
      },
    });

    return {
      success: true,
      data: serializeCustomers(customers),
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: "Failed to fetch customers.",
    };
  }
}
