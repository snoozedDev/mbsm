"use client";

import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { store } from "@/redux/store";
import { Noto_Sans_JP } from "next/font/google";
import { Provider } from "react-redux";
import "./globals.css";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

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
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              {children}
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
