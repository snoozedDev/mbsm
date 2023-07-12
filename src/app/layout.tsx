import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBSM",
  description: "soon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          noto.className,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
