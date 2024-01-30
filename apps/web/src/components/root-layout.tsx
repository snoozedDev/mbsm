"use client";
import { store } from "@/redux/store";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryLayout } from "./query-layout";

export const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NextTopLoader
        showSpinner={false}
        color="hsl(var(--muted-foreground))"
        height={1}
      />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryLayout>
          <Provider store={store}>{children}</Provider>
        </QueryLayout>
      </ThemeProvider>
    </>
  );
};
