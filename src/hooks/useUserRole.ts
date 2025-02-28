import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/api";

export function useUserRole() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
  return user?.userAccount?.role;
} 