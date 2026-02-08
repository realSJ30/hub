# Prisma Setup Guide

This project uses **Prisma ORM** on top of **Supabase Postgres** for schema management and type-safe database access.

## Overview

- **Database**: Supabase Postgres
- **Auth**: Supabase Auth (unchanged)
- **ORM**: Prisma (for schema definition and migrations only)
- **Schemas**: `auth` (Supabase managed) and `public` (application data)

## Configuration

### Environment Variables

The `DATABASE_URL` in `.env` connects Prisma to your Supabase Postgres instance:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public"
```

### Prisma Files

- **`prisma/schema.prisma`**: Schema definition
- **`prisma.config.ts`**: Prisma configuration (connection, migrations path)
- **`lib/prisma.ts`**: Prisma Client singleton
- **`lib/generated/prisma/`**: Auto-generated Prisma Client (gitignored)

## Current Schema

### Models

#### `User` (auth.users)

- Read-only reference to Supabase Auth users
- Managed by Supabase, not by Prisma migrations
- Used only for foreign key relationships

#### `Unit` (public.units)

- Rental vehicle/unit data
- Fields: `id`, `name`, `brand`, `plate`, `transmission`, `capacity`, `pricePerDay`, `status`, `imageUrl`
- Timestamps: `createdAt`, `updatedAt`
- Relationship: `createdBy` → `User` (via `createdById`)

#### `UnitStatus` Enum

- `AVAILABLE`
- `RENTED`
- `MAINTENANCE`

## Commands

### Generate Prisma Client

After any schema changes:

```bash
npx prisma generate
```

### Create Migration

```bash
npx prisma migrate dev --name <migration_name>
```

### Apply Migrations (Production)

```bash
npx prisma migrate deploy
```

### View Database in Prisma Studio

```bash
npx prisma studio
```

### Format Schema

```bash
npx prisma format
```

## Usage Example

```typescript
import { prisma } from "@/lib/prisma";

// Fetch all available units
const units = await prisma.unit.findMany({
  where: { status: "AVAILABLE" },
  include: { createdBy: true },
});

// Create a new unit
const newUnit = await prisma.unit.create({
  data: {
    name: "Toyota Hiace",
    brand: "Toyota",
    plate: "ABC-1234",
    transmission: "Automatic",
    capacity: 15,
    pricePerDay: 3500,
    status: "AVAILABLE",
    createdById: userId, // from Supabase Auth
  },
});
```

## Important Notes

### ⚠️ Supabase Auth Integration

- The `User` model references `auth.users` (Supabase's auth schema)
- **Do NOT run migrations that modify the `auth` schema**
- The `User` model is for type safety and relationships only

### ⚠️ Multi-Schema Support

- Prisma is configured to work with both `auth` and `public` schemas
- Models specify their schema using `@@schema("public")` or `@@schema("auth")`

### ⚠️ UUID Generation

- Uses PostgreSQL's `gen_random_uuid()` for ID generation
- Compatible with Supabase's default UUID setup

## Next Steps

1. **Create the initial migration**:

   ```bash
   npx prisma migrate dev --name init
   ```

2. **Verify the schema** in Supabase Dashboard or Prisma Studio

3. **Start using Prisma Client** in your Next.js app:
   ```typescript
   import { prisma } from "@/lib/prisma";
   ```

## Troubleshooting

### "Cannot find module './generated/prisma'"

Run `npx prisma generate` to generate the Prisma Client.

### Migration Errors

- Ensure `DATABASE_URL` is correct in `.env`
- Check Supabase connection pooler settings if using connection pooling
- Verify database permissions

### Schema Sync Issues

Use `npx prisma db pull` to introspect the current database and sync your schema.
