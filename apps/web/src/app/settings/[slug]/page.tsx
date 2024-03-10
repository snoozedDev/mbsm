import { UserFilesPage } from "@/components/pages/user-files-page";
import UserSettingsPage from "@/components/pages/user-settings-page";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnverifiedEmailWarning } from "@/components/unverified-email-warning";
import { UserAccountsPage } from "@/components/user-accounts";
import { UserSecurityPage } from "@/components/user-passkeys";
import { Metadata } from "next";
import Link from "next/link";

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
        <h2 className="text-4xl font-medium tracking-wide">Settings</h2>
        {/* <p className="text-muted-foreground">
      Manage your user and account settings.
    </p> */}
      </div>
      <Separator className="my-4" />
      <div className="flex items-stretch max-md:flex-col my-4 w-full">
        <aside className="flex h-full items-stretch max-md:flex-1 md:max-w-[250px] w-full self-start max-md:mb-4">
          <div className="flex-1 flex">
            <Tabs value={slug} className="flex-1">
              <TabsList className="md:flex-col md:space-y-2 md:h-auto md:items-stretch w-full justify-start max-md:overflow-x-scroll max-md:no-scrollbar md:bg-background">
                {typedObjectKeys(settingsPageMap).map((page) => (
                  <TabsTrigger
                    key={page}
                    value={page}
                    asChild
                    className="hover:bg-muted/50 data-[state=active]:font-medium md:data-[state=active]:bg-muted md:data-[state=active]:text-foreground"
                  >
                    <Link
                      key={page}
                      href={`/settings/${page}`}
                      className="text-base md:justify-start md:py-2"
                    >
                      {page.charAt(0).toUpperCase() + page.slice(1)}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </aside>
        <main className="flex-grow space-y-4 flex flex-col md:ml-4">
          <UnverifiedEmailWarning />
          {settingsPageMap[slug]}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
