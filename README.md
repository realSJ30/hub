# RentHub

A modern rental management platform built with Next.js, Prisma, and Supabase.

## 🏗️ Architecture Overview

RentHub follows a **layered architecture** designed for scalability and type safety:

- **UI Layer (React)**: Client components using TanStack Form and ShadCN UI.
- **State Layer (Hooks)**: Custom hooks using TanStack Query for data fetching and mutations.
- **Service Layer (Actions)**: Next.js Server Actions for authenticated business logic and database interactions.
- **Data Layer (Prisma)**: Type-safe ORM managing PostgreSQL via Supabase.

## 📁 Project Structure

- `app/`: Next.js App Router (Routes, Layouts, and Server Actions).
- `components/`: Modular UI components and context providers.
- `hooks/`: Domain-specific hooks abstracting data logic.
- `lib/`: Core utilities, Zod schemas, and Prisma configuration.
- `prisma/`: Database schema and migrations.

## 🎯 Architectural Patterns

### **Business Logic & Persistence**

Logic is centralized in **Server Actions**, ensuring security and server-side validation. **Prisma** provides type-safe access to the PostgreSQL database hosted on **Supabase**.

### **State & Data Management**

- **TanStack Query**: Manages client-side server state, caching, and background refetching.
- **TanStack Form**: Provides type-safe form state and validation.
- **Custom Hooks**: Abstract specific operations (e.g., `useUnit` handles fleet management).

### **Validation & Serialization**

- **Zod**: Shared schemas used for both client and server validation.
- **Serializers**: Utilities that convert Prisma-specific types (like Decimal) into JSON-safe formats for the frontend.

## 🔐 Auth & Security

Authentication is managed via **Supabase Auth**. Cookies are used for session management, and Server Actions verify user context before performing any restricted operations.

## 🚀 Getting Started

1. **Install**: `npm install`
2. **Environment**: Configure `.env` with Supabase and Database credentials.
3. **Database**: `npx prisma generate` followed by `npx prisma migrate dev`.
4. **Run**: `npm run dev`

## 🛠️ Commands

- `npm run db:migrate`: Create and apply migrations.
- `npm run db:studio`: Open database GUI.
- `npm run lint`: Check code quality.

---

**Built with Next.js, Prisma, and Supabase**
