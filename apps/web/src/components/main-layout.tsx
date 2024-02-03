import { getUserInfo } from "@/app/actions/authActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { QueryLayout } from "./query-layout";
import { SiteHeader } from "./site-header";
import { ThemeSwitcher } from "./theme-switcher";
import { Toaster } from "./ui/toaster";

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof QueryLayout>;

export const MainLayout = async ({ children }: Props) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1 border-b flex flex-col">{children}</div>
        <footer className="py-4 md:px-8 md:py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              built by me © {new Date().getFullYear()}
            </p>
            <ThemeSwitcher />
          </div>
        </footer>
        <Toaster />
      </div>
    </HydrationBoundary>
  );
};
