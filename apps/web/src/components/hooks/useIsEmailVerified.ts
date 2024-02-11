import { useUserMeQuery } from "@/queries/userQueries";

export const useIsEmailVerified = () => {
  const { data, isLoading } = useUserMeQuery();
  if (isLoading) return false;
  if (!data) return false;
  if (data.success === false) return false;
  return data;
};
