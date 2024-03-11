import { UserFilesPage } from "@/components/pages/user-files-page";
import UserSettingsPage from "@/components/pages/user-settings-page";
import { SettingsNavigator } from "@/components/settings-navigator";
import { Separator } from "@/components/ui/separator";
import { UnverifiedEmailWarning } from "@/components/unverified-email-warning";
import { UserAccountsPage } from "@/components/user-accounts";
import { UserSecurityPage } from "@/components/user-passkeys";
import { Metadata } from "next";

const settingsPageMap = {
  user: <UserSettingsPage />,
  accounts: <UserAccountsPage />,
  security: <UserSecurityPage />,
  files: <UserFilesPage />,
} as const;

type Props = { params: { slug: keyof typeof settingsPageMap } };

const typedObjectKeys = <T extends Record<string, unknown>>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

export const generateMetadata = async ({
  params: { slug },
}: Props): Promise<Metadata> => {
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} • Settings • MBSM`,
  };
};

const SettingsPage = ({ params: { slug } }: Props) => {
  return (
    <div className="flex flex-col self-center p-4 max-w-5xl w-full">
      <div className="space-y-0.5">
        <h2 className="text-4xl font-medium tracking-wide mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Manage your user and account settings.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex items-stretch max-md:flex-col my-4 w-full">
        <SettingsNavigator
          values={typedObjectKeys(settingsPageMap)}
          value={slug}
        />
        <main className="flex-grow space-y-4 flex flex-col md:ml-4">
          <UnverifiedEmailWarning />
          {settingsPageMap[slug]}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
