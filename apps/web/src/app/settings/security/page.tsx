import { UserPasskeys } from "@/components/user-passkeys";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security • Settings • MBSM",
};

const SecuritySettingsPage = () => {
  return <UserPasskeys />;
};

export default SecuritySettingsPage;
