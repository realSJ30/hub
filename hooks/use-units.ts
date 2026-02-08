import { useQuery } from "@tanstack/react-query";
import { getUnits } from "@/app/actions/unit.actions";

/**
 * Custom hook for fetching all units
 * 
 * This hook uses TanStack Query to fetch and cache the list of units.
 * It handles loading, success, and error states automatically.
 * 
 * @returns TanStack Query query object with:
 *   - data: Array of units
 *   - isLoading: Loading state
 *   - isError: Error state
 *   - error: Error object if query failed
 *   - refetch: Function to manually refetch the data
 * 
 * @example
 * ```tsx
 * const { data, isLoading, isError, error } = useUnits();
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (isError) return <div>Error: {error.message}</div>;
 * 
 * return <div>{data?.data?.length} units found</div>;
 * ```
 */
export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const result = await getUnits();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch units");
      }
      
      return result;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
  });
}
