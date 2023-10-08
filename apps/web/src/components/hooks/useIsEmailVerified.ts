import { useUserQuery } from "@/queries/authQueries";

export const useIsEmailVerified = () => {
  const { data, isLoading } = useUserQuery();
  return isLoading || !data ? undefined : data.emailVerified;
};
