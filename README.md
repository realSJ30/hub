# RentHub

A modern rental management platform built with Next.js, Prisma, and Supabase.

## 🏗️ Architecture Overview

RentHub follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Client Components (UI)          │  ← React components, forms, tables
├─────────────────────────────────────────┤
│      Custom Hooks (State Logic)         │  ← TanStack Query mutations/queries
├─────────────────────────────────────────┤
│    Server Actions (Business Logic)      │  ← Data validation, auth checks
├─────────────────────────────────────────┤
│       Prisma ORM (Data Access)          │  ← Type-safe database queries
├─────────────────────────────────────────┤
│    Supabase PostgreSQL (Database)       │  ← Persistent storage
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
rent-hub/
├── app/                          # Next.js App Router
│   ├── (private)/               # Protected routes (requires auth)
│   │   └── units/               # Units management pages
│   ├── (root)/                  # Public routes
│   ├── actions/                 # Server Actions (business logic)
│   │   ├── auth.actions.ts      # Authentication operations
│   │   └── unit.actions.ts      # Unit CRUD operations
│   └── layout.tsx               # Root layout with providers
│
├── components/                   # Reusable UI components
│   ├── providers/               # Context providers (TanStack Query, etc.)
│   └── ui/                      # shadcn/ui components
│
├── hooks/                        # Custom React hooks
│   ├── use-create-unit.ts       # Unit creation mutation
│   └── use-units.ts             # Units fetching query
│
├── lib/                          # Core utilities
│   ├── generated/prisma/        # Generated Prisma Client
│   ├── prisma.ts                # Prisma Client singleton
│   ├── serializers/             # Data serialization utilities
│   └── validations/             # Zod schemas for validation
│
├── prisma/                       # Prisma ORM configuration
│   ├── schema.prisma            # Database schema definition
│   └── migrations/              # Database migrations
│
└── utils/                        # Helper utilities
    └── supabase/                # Supabase client configuration
```

## 🔑 Core Technologies

### **Next.js 16 (App Router)**

- Server Components for initial page loads
- Client Components for interactive UI
- Server Actions for mutations
- File-based routing with route groups

### **Prisma 7 (ORM)**

- Type-safe database access
- Schema-first development
- Automatic migrations
- Uses `@prisma/adapter-pg` for PostgreSQL connection

### **Supabase**

- PostgreSQL database hosting
- Authentication (email/password)
- Row-level security
- Real-time subscriptions (future)

### **TanStack Query**

- Client-side state management
- Automatic caching and refetching
- Optimistic updates
- Loading/error state handling

### **Zod**

- Runtime type validation
- Schema-based validation
- Type inference for TypeScript

## 🎯 Key Architectural Patterns

### **Server Actions Pattern**

Server Actions handle all data mutations and business logic:

```typescript
// app/actions/unit.actions.ts
export async function createUnit(data: CreateUnitInput) {
  // 1. Validate input
  // 2. Check authentication
  // 3. Perform database operation
  // 4. Serialize response
  // 5. Revalidate cache
}
```

**Why**: Keeps business logic on the server, ensures security, enables progressive enhancement.

### **Custom Hooks Pattern**

Hooks abstract TanStack Query logic for reusability:

```typescript
// hooks/use-create-unit.ts
export function useCreateUnit() {
  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries(["units"]);
    },
  });
}
```

**Why**: Separates data fetching from UI, enables consistent error handling, simplifies testing.

### **Data Serialization Pattern**

Converts Prisma types to JSON-safe formats:

```typescript
// lib/serializers/unit.serializer.ts
export function serializeUnit(unit: Unit) {
  return {
    ...unit,
    pricePerDay: Number(unit.pricePerDay), // Decimal → number
    createdAt: unit.createdAt.toISOString(), // Date → string
  };
}
```

**Why**: Next.js requires JSON-serializable data for Client Components. Prisma's `Decimal` and `Date` types must be converted.

### **Validation Pattern**

Shared Zod schemas for client and server validation:

```typescript
// lib/validations/unit.schema.ts
export const createUnitSchema = z.object({
  name: z.string().min(3),
  pricePerDay: z.number().positive(),
  // ...
});
```

**Why**: Single source of truth, prevents invalid data, provides TypeScript types.

## 📊 Data Flow

### **Fetching and Displaying Data**

The application uses a consistent pattern for fetching and displaying live database data:

```
Database (PostgreSQL)
    ↓
Prisma ORM (type-safe queries)
    ↓
Server Action (getUnits)
    ↓
Serialization (Decimal → number, Date → string)
    ↓
Custom Hook (useUnits with TanStack Query)
    ↓
Client Component (Units page)
    ↓
Data Table (ShadCN + TanStack Table)
```

**Example: Units List Page**

1. **Page Component** (`app/(private)/units/page.tsx`) uses `useUnits()` hook
2. **Custom Hook** (`hooks/use-units.ts`) calls `getUnits()` Server Action
3. **Server Action** (`app/actions/unit.actions.ts`) queries database via Prisma
4. **Serialization** converts Prisma types to JSON-safe formats
5. **TanStack Query** caches data and manages loading/error states
6. **UI** renders data in table with sorting, filtering, and pagination

**Benefits**:

- Automatic loading and error states
- Client-side caching (5-minute stale time)
- Type safety from database to UI
- Automatic refetching on window focus
- Optimistic updates on mutations

## 🔐 Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Supabase sets HTTP-only cookies
3. Server Actions verify auth via `createClient()`
4. Protected routes check auth in middleware/layouts
5. User ID from Supabase used for `createdById` in Prisma

## 🗄️ Database Schema

See [DATABASE.md](./DATABASE.md) for the complete entity-relationship diagram.

**Key Models**:

- **Unit** - Rental vehicles/properties with pricing and availability
- Future: Bookings, Customers, Payments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (via Supabase)
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials and DATABASE_URL

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Database Commands

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Create and apply a new migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Push schema changes without migration (dev only)
npm run db:push
```

## 📚 Additional Documentation

- [DATABASE.md](./DATABASE.md) - Database schema and relationships
- [PRISMA.md](./PRISMA.md) - Prisma setup and usage guide

## 🛠️ Development Workflow

1. **Define schema** in `prisma/schema.prisma`
2. **Create migration** with `npm run db:migrate`
3. **Create validation schema** in `lib/validations/`
4. **Implement Server Action** in `app/actions/`
5. **Create custom hook** in `hooks/`
6. **Build UI component** in `app/` or `components/`

## 🧪 Testing

```bash
# Run type checking
npx tsc --noEmit

# Run linter
npm run lint
```

## 📦 Key Dependencies

| Package                 | Purpose                                |
| ----------------------- | -------------------------------------- |
| `next`                  | React framework with App Router        |
| `@prisma/client`        | Type-safe database client              |
| `@prisma/adapter-pg`    | PostgreSQL driver adapter for Prisma 7 |
| `@supabase/ssr`         | Supabase client for Next.js            |
| `@tanstack/react-query` | Async state management                 |
| `@tanstack/react-form`  | Form state management                  |
| `zod`                   | Schema validation                      |

## 🤝 Contributing

1. Follow the established patterns (Server Actions + Custom Hooks)
2. Always validate input with Zod schemas
3. Serialize Prisma data before returning to client
4. Use TypeScript strictly (no `any` types)
5. Keep components small and focused

## 📝 License

[Your License Here]

---

**Built with ❤️ using Next.js, Prisma, and Supabase**
