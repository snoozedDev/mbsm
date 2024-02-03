import { useUserQuery } from "@/queries/authQueries";

export const useIsEmailVerified = () => {
  const { data, isLoading } = useUserQuery();
  if (isLoading) return false;
  if (!data) return false;
  if (data.success === false) return false;
  return data.emailVerified;
};
