"use client";
import { FadeFromBelow } from "@/components/containers/fade-from-below";
import UserSettingsPage from "@/components/pages/user-settings-page";

const Page = () => {
  return (
    <FadeFromBelow>
      <UserSettingsPage />
    </FadeFromBelow>
  );
};

export default Page;
