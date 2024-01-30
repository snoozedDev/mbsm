"use client";
import { FadeFromBelow } from "@/components/containers/fade-from-below";
import { UserPasskeys } from "@/components/user-passkeys";

// export const metadata: Metadata = {
//   title: "Security • Settings • MBSM",
// };

const SecuritySettingsPage = () => {
  return (
    <FadeFromBelow>
      <UserPasskeys />
    </FadeFromBelow>
  );
};

export default SecuritySettingsPage;
