"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createUnitSchema, type CreateUnitInput, type UnitFilters } from "@/lib/validations/unit.schema";
import { createClient } from "@/utils/supabase/server";
import { serializeUnit, serializeUnits } from "@/lib/serializers/unit.serializer";
import { Prisma } from "@/lib/generated/prisma";

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
        year: validationResult.data.year,
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
export async function getUnits(filters?: UnitFilters) {
  try {
    const where: Prisma.UnitWhereInput = {};

    if (filters) {
      if (filters.status && filters.status !== "ALL") {
        where.status = filters.status as any;
      }
      if (filters.name) {
        where.name = { contains: filters.name, mode: "insensitive" };
      }
      if (filters.brand) {
        where.brand = { contains: filters.brand, mode: "insensitive" };
      }
      if (filters.plate) {
        where.plate = { contains: filters.plate, mode: "insensitive" };
      }
      if (filters.transmission && filters.transmission !== "ALL") {
        where.transmission = filters.transmission;
      }
      
      if (filters.yearMin !== undefined || filters.yearMax !== undefined) {
        where.year = {
          gte: filters.yearMin,
          lte: filters.yearMax,
        };
      }

      if (filters.capacityMin !== undefined || filters.capacityMax !== undefined) {
        where.capacity = {
          gte: filters.capacityMin,
          lte: filters.capacityMax,
        };
      }

      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        where.pricePerDay = {
          gte: filters.priceMin,
          lte: filters.priceMax,
        };
      }
    }

    const units = await prisma.unit.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

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

/**
 * Server Action: Update an existing unit
 * 
 * @param id - The ID of the unit to update
 * @param data - The unit data to update
 * @returns Object containing either the updated unit or an error message
 */
export async function updateUnit(id: string, data: CreateUnitInput) {
  try {
    // Validate input data
    const validationResult = createUnitSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validationResult.error.flatten().fieldErrors,
      };
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Update unit in database
    const unit = await prisma.unit.update({
      where: { id },
      data: {
        name: validationResult.data.name,
        brand: validationResult.data.brand,
        year: validationResult.data.year,
        plate: validationResult.data.plate.toUpperCase(),
        transmission: validationResult.data.transmission,
        capacity: validationResult.data.capacity,
        pricePerDay: validationResult.data.pricePerDay,
        status: validationResult.data.status,
        imageUrl: validationResult.data.imageUrl || null,
      },
    });

    // Revalidate paths
    revalidatePath("/units");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeUnit(unit),
    };
  } catch (error) {
    console.error("Error updating unit:", error);
    
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "A unit with this plate number already exists.",
      };
    }

    return {
      success: false,
      error: "Failed to update unit.",
    };
  }
}

/**
 * Server Action: Delete a unit
 * 
 * @param id - The ID of the unit to delete
 * @returns Object indicating success or failure
 */
export async function deleteUnit(id: string) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Delete unit from database
    await prisma.unit.delete({
      where: { id },
    });

    // Revalidate paths
    revalidatePath("/units");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return {
      success: false,
      error: "Failed to delete unit.",
    };
  }
}


