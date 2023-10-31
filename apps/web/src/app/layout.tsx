import { MainLayout } from "@/components/main-layout";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font";
import "./globals.css";

const IS_PROD = process.env.NODE_ENV === "production";

if (IS_PROD) console.log = () => {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
