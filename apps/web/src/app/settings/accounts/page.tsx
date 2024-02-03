import { UserAccounts } from "@/components/user-accounts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts • Settings • MBSM",
};

const AccountsSettingsPage = () => {
  return <UserAccounts />;
};

export default AccountsSettingsPage;
