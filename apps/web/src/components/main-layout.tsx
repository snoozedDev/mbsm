import type { ComponentProps } from "react";
import { Footer } from "./footer";
import { QueryLayout } from "./query-layout";
import { SiteHeader } from "./site-header";
import { Toaster } from "./ui/sonner";

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof QueryLayout>;

export const MainLayout = ({ children }: Props) => (
  <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <div className="flex-1 border-b flex flex-col">{children}</div>
    <Footer />
    <Toaster />
  </div>
);
