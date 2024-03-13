import { MainLayout } from "@/components/main-layout";
import { RootLayout } from "@/components/root-layout";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const IS_PROD = process.env.NODE_ENV === "production";

if (IS_PROD) console.log = () => {};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background font-sans antialiased flex flex-col min-h-screen"
      >
        <RootLayout>
          <MainLayout>{children}</MainLayout>
        </RootLayout>
      </body>
    </html>
  );
}
