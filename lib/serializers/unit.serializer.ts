import type { Unit } from "@/lib/generated/prisma";

/**
 * Serializes a Prisma Unit object for client components
 * 
 * Converts Decimal and Date objects to JSON-serializable formats
 * to prevent Next.js serialization errors when passing data from
 * Server Components/Actions to Client Components.
 * 
 * @param unit - The unit object from Prisma
 * @returns Serialized unit object safe for client components
 */
export function serializeUnit(unit: any) {
  return {
    id: unit.id,
    name: unit.name,
    brand: unit.brand,
    year: unit.year,
    plate: unit.plate,
    transmission: unit.transmission,
    capacity: unit.capacity,
    pricePerDay: Number(unit.pricePerDay),
    status: unit.status,
    imageUrl: unit.imageUrl,
    createdAt: unit.createdAt instanceof Date ? unit.createdAt.toISOString() : unit.createdAt,
    updatedAt: unit.updatedAt instanceof Date ? unit.updatedAt.toISOString() : unit.updatedAt,
    createdById: unit.createdById,
  };
}

/**
 * Serializes an array of Prisma Unit objects
 * 
 * @param units - Array of unit objects from Prisma
 * @returns Array of serialized units
 */
export function serializeUnits(units: Unit[]) {
  return units.map(serializeUnit);
}

/**
 * Type for a serialized unit (safe for client components)
 */
export type SerializedUnit = ReturnType<typeof serializeUnit>;
