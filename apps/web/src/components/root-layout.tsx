import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { CommandBarProvider } from "./command-bar";
import { ModalsProvider } from "./modals-layer";
import { QueryLayout } from "./query-layout";
import { StoreProvider } from "./store-provider";
import { NextThemeProvider } from "./theme-provider";
import { TooltipProvider } from "./ui/tooltip";

export const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NextTopLoader
        showSpinner={false}
        color="hsl(var(--muted-foreground))"
        height={1}
      />
      <NextThemeProvider>
        <TooltipProvider>
          <QueryLayout>
            <StoreProvider>
              <ModalsProvider>
                <CommandBarProvider>{children}</CommandBarProvider>
              </ModalsProvider>
            </StoreProvider>
          </QueryLayout>
        </TooltipProvider>
      </NextThemeProvider>
    </>
  );
};
