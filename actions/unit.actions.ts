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

    // Check subscription status
    const { getUserSubscriptionStatus } = await import("@/actions/stripe.actions");
    const { isPro } = await getUserSubscriptionStatus();

    if (!isPro) {
      const existingUnitsCount = await prisma.unit.count({
        where: { createdById: user.id },
      });
      if (existingUnitsCount >= 1) {
        return {
          success: false,
          error: "Free users can only manage 1 unit. Please upgrade to Pro to add more units.",
        };
      }
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const where: Prisma.UnitWhereInput = { createdById: user.id };

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

    // Check subscription status to enforce limit on list
    const { getUserSubscriptionStatus } = await import("@/actions/stripe.actions");
    const { isPro } = await getUserSubscriptionStatus();

    console.log(`[getUnits] User ID: ${user.id}`);
    console.log(`[getUnits] Filters: ${JSON.stringify(filters)}`);
    console.log(`[getUnits] Final where: ${JSON.stringify(where)}`);

    const units = await prisma.unit.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`[getUnits] Found ${units.length} units.`);
    if (units.length > 0) {
      console.log(`[getUnits] First unit createdById: ${units[0].createdById}`);
    }

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

    // Verify ownership
    const existing = await prisma.unit.findFirst({
      where: { id, createdById: user.id },
    });
    if (!existing) {
      return { success: false, error: "Unit not found or unauthorized" };
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
    revalidatePath(`/units/${id}`);
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

    // Verify ownership
    const existing = await prisma.unit.findFirst({
      where: { id, createdById: user.id },
    });
    if (!existing) {
      return { success: false, error: "Unit not found or unauthorized" };
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

export async function getUnit(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const unit = await prisma.unit.findFirst({
      where: { id, createdById: user.id },
    });

    if (!unit) {
      return { success: false, error: "Unit not found" };
    }

    return {
      success: true,
      data: serializeUnit(unit),
    };
  } catch (error) {
    console.error("Error fetching unit:", error);
    return {
      success: false,
      error: "Failed to fetch unit details.",
    };
  }
}

/**
 * Server Action: Upload a unit image to Supabase Storage
 *
 * Accepts a FormData payload containing a single "file" entry.
 * Validates the file type (image/jpeg) and size (≤ 1 MB) on the
 * server before uploading to the `units` storage bucket.
 *
 * NOTE: File objects cannot be serialised across the server/client
 * boundary, so FormData is the correct transport here.
 *
 * @param formData - FormData with a "file" field containing the image
 * @returns Object containing either the public image URL or an error
 */
export async function uploadUnitImage(formData: FormData) {
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
  const ALLOWED_TYPE = "image/jpeg";
  const BUCKET = "units";

  try {
    // Authenticate
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Extract file
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, error: "No file provided." };
    }

    // Validate type
    if (file.type !== ALLOWED_TYPE) {
      return { success: false, error: "Only JPEG images are allowed." };
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Image must be 1 MB or smaller." };
    }

    // Build a unique storage path
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: ALLOWED_TYPE, upsert: false });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return { success: true, data: { publicUrl: publicUrlData.publicUrl } };
  } catch (error) {
    console.error("Error uploading unit image:", error);
    return { success: false, error: "Failed to upload image. Please try again." };
  }
}
