import { MainLayout } from "@/components/main-layout";
import { RootLayout } from "@/components/root-layout";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font";
import "./globals.css";

const IS_PROD = process.env.NODE_ENV === "production";

if (IS_PROD) console.log = () => {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={cn("min-h-screen bg-background font-sans antialiased")}
      >
        <RootLayout>
          <MainLayout>{children}</MainLayout>
        </RootLayout>
      </body>
    </html>
  );
}
