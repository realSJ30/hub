"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createUnitSchema, type CreateUnitInput } from "@/lib/validations/unit.schema";
import { createClient } from "@/utils/supabase/server";
import { serializeUnit, serializeUnits } from "@/lib/serializers/unit.serializer";

/**
 * Server Action: Create a new unit
 * 
 * This action handles the database insertion logic for creating a new rental unit.
 * It validates the input data, checks user authentication, and inserts the unit into the database.
 * 
 * @param data - The unit data to create (validated against createUnitSchema)
 * @returns Object containing either the created unit or an error message
 */
export async function createUnit(data: CreateUnitInput) {
  try {
    // Validate input data using Zod schema
    const validationResult = createUnitSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validationResult.error.flatten().fieldErrors,
      };
    }

    // Get authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to create a unit.",
      };
    }

    // Insert unit into database using Prisma
    const unit = await prisma.unit.create({
      data: {
        name: validationResult.data.name,
        brand: validationResult.data.brand,
        plate: validationResult.data.plate.toUpperCase(), // Ensure uppercase
        transmission: validationResult.data.transmission,
        capacity: validationResult.data.capacity,
        pricePerDay: validationResult.data.pricePerDay,
        status: validationResult.data.status,
        imageUrl: validationResult.data.imageUrl || null,
        createdById: user.id,
      },
    });

    // Revalidate the units page to show the new unit
    revalidatePath("/units");
    revalidatePath("/dashboard");

    // Serialize the data for client components (convert Decimal to number)
    return {
      success: true,
      data: serializeUnit(unit),
    };
  } catch (error) {
    console.error("Error creating unit:", error);

    // Handle unique constraint violation (duplicate plate number)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "A unit with this plate number already exists.",
      };
    }

    return {
      success: false,
      error: "Failed to create unit. Please try again.",
    };
  }
}

/**
 * Server Action: Get all units
 * 
 * Fetches all units from the database with optional filtering.
 * 
 * @returns Array of units or error
 */
export async function getUnits() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize the data for client components
    return {
      success: true,
      data: serializeUnits(units),
    };
  } catch (error) {
    console.error("Error fetching units:", error);
    return {
      success: false,
      error: "Failed to fetch units.",
    };
  }
}
