import { useUserMeQuery } from "@/queries/userQueries";

export const useIsEmailVerified = () => {
  const { data, isLoading } = useUserMeQuery();
  return {
    isPending: isLoading,
    emailVerified: data?.success === true ? data.emailVerified : false,
  };
};
