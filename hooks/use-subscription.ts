import { useQuery } from "@tanstack/react-query";
import { getUserSubscriptionStatus } from "@/actions/stripe.actions";

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const result = await getUserSubscriptionStatus();
      return result;
    },
  });
}
