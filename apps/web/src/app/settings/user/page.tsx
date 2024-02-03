import UserSettingsPage from "@/components/pages/user-settings-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User • Settings • MBSM",
};

const Page = () => {
  return <UserSettingsPage />;
};

export default Page;
