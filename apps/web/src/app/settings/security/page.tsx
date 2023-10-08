"use client";
import { FadeFromBelow } from "@/components/containers/fade-from-below";
import { UserPasskeys } from "@/components/user-passkeys";

const SecuritySettingsPage = () => {
  return (
    <FadeFromBelow>
      <UserPasskeys />
    </FadeFromBelow>
  );
};

export default SecuritySettingsPage;
