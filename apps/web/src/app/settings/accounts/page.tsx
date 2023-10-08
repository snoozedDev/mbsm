"use client";
import { FadeFromBelow } from "@/components/containers/fade-from-below";
import { useUserQuery } from "@/queries/authQueries";

const AccountsSettingsPage = () => {
  const { data: user, isLoading } = useUserQuery();

  return (
    <FadeFromBelow>{isLoading ? <h1>loading</h1> : <div />}</FadeFromBelow>
  );
};

export default AccountsSettingsPage;
