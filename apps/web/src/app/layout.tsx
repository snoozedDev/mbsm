"use client";

import { ThemeProvider } from "@/components/containers/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { queryClient } from "@/queries/queryClient";
import { store } from "@/redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Noto_Sans_JP } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";
import "./globals.css";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          noto.className,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <NextTopLoader
          showSpinner={false}
          color="hsl(var(--muted-foreground))"
          height={1}
        />
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                {children}
                <Toaster />
              </div>
            </ThemeProvider>
          </Provider>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
