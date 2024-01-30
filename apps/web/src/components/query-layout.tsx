"use client";
import { queryClient as reactQueryClient } from "@/queries/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

const IS_PROD = process.env.NODE_ENV === "production";

export const QueryLayout = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => reactQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {!IS_PROD && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
