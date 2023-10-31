"use client";
import { queryClient } from "@/queries/queryClient";
import { store } from "@/redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { SiteHeader } from "./site-header";
import { Toaster } from "./ui/toaster";
const IS_PROD = process.env.NODE_ENV === "production";

export const MainLayout = ({ children }: { children: ReactNode }) => (
  <>
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
      {!IS_PROD && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </>
);
