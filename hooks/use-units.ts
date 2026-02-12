import { useQuery } from "@tanstack/react-query";
import { getUnits } from "@/actions/unit.actions";
import type { UnitFilters } from "@/lib/validations/unit.schema";

/**
 * Custom hook for fetching all units with optional filtering
 */
export function useUnits(filters?: UnitFilters) {
  return useQuery({
    queryKey: ["units", filters],
    queryFn: async () => {
      const result = await getUnits(filters);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch units");
      }
      
      return result;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

