"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query Provider Component
 *
 * This component wraps the application with QueryClientProvider to enable
 * TanStack Query functionality throughout the app.
 *
 * It creates a new QueryClient instance per component instance to avoid
 * sharing state between different users in SSR scenarios.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // Create a new QueryClient instance for each component instance
  // This prevents state sharing between users in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default options for all queries
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            // Default options for all mutations
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
