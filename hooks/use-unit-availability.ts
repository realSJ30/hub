import { useQuery } from "@tanstack/react-query";
import { getUnitAvailability } from "@/actions/booking.actions";

export function useUnitAvailability(unitId: string | undefined) {
  return useQuery({
    queryKey: ["unit-availability", unitId],
    queryFn: async () => {
      if (!unitId) return { success: true, data: [] };
      const result = await getUnitAvailability(unitId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch availability");
      }
      return result;
    },
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
