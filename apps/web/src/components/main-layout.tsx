import type { ComponentProps } from "react";
import { QueryLayout } from "./query-layout";
import { SiteHeader } from "./site-header";
import { Toaster } from "./ui/toaster";

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof QueryLayout>;

export const MainLayout = ({ children }: Props) => {
  return (
    <QueryLayout>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        {children}
        <Toaster />
      </div>
    </QueryLayout>
  );
};
