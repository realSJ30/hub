/*
  Simplify UnitStatus enum:
  - AVAILABLE → OPERATIONAL
  - RENTED → OPERATIONAL (a unit being rented is still operational)
  - MAINTENANCE stays as MAINTENANCE
*/

-- Step 1: Drop the default so we can alter the column
ALTER TABLE "public"."units" ALTER COLUMN "status" DROP DEFAULT;

-- Step 2: Convert column to text temporarily
ALTER TABLE "public"."units" ALTER COLUMN "status" TYPE text;

-- Step 3: Map old values to new values
UPDATE "public"."units" SET "status" = 'OPERATIONAL' WHERE "status" IN ('AVAILABLE', 'RENTED');

-- Step 4: Create the new enum
CREATE TYPE "UnitStatus_new" AS ENUM ('OPERATIONAL', 'MAINTENANCE');

-- Step 5: Convert column to the new enum
ALTER TABLE "public"."units" ALTER COLUMN "status" TYPE "UnitStatus_new" USING ("status"::"UnitStatus_new");

-- Step 6: Drop the old enum and rename the new one
DROP TYPE "public"."UnitStatus";
ALTER TYPE "UnitStatus_new" RENAME TO "UnitStatus";

-- Step 7: Restore the default
ALTER TABLE "public"."units" ALTER COLUMN "status" SET DEFAULT 'OPERATIONAL'::"UnitStatus";
