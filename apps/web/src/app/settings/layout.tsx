"use client";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnverifiedEmailWarning } from "@/components/unverified-email-warning";
import { useIsLoggedIn } from "@/queries/authQueries";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const settingPages = ["User", "Security", "Accounts"];

const SettingsPage = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isPending } = useIsLoggedIn();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn && !isPending) router.push("/");
  }, [isLoggedIn, isPending, router]);

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
            <Tabs value={pathname} className="flex-1">
              <TabsList className="md:flex-col md:space-y-2 md:h-auto md:items-stretch w-full justify-start max-md:overflow-x-scroll max-md:no-scrollbar md:bg-background">
                {settingPages.map((page) => (
                  <TabsTrigger
                    key={page}
                    value={`/settings/${page.toLowerCase()}`}
                    asChild
                    className="font-light hover:bg-muted/50 data-[state=active]:font-medium md:data-[state=active]:bg-muted md:data-[state=active]:text-foreground"
                  >
                    <Link
                      key={page}
                      href={`/settings/${page.replace(" ", "-").toLowerCase()}`}
                      className="text-base md:justify-start md:py-2"
                    >
                      {page}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </aside>
        <main className="flex-grow space-y-4 flex flex-col md:ml-4">
          <UnverifiedEmailWarning />
          <AnimatePresence initial={false}>{children}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
