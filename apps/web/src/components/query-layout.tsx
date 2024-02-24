"use client";
import type { AppRouter } from "@/server/appRouter";
import { api } from "@/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { ReactNode, useState } from "react";

const IS_PROD = process.env.NODE_ENV === "production";

export const trpc = createTRPCReact<AppRouter>();

export const QueryLayout = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: "offlineFirst",
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
            staleTime: 1000 * 60, // 5 seconds
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api",
          fetch: async (url, opt) => {
            const method = opt?.method ?? "GET";
            const { get, post } = api;
            if (typeof url === "string") {
              const path = url.split("/api")[1];
              const res =
                method === "GET"
                  ? await get(path, {
                      headers: opt?.headers as Record<string, string>,
                    })
                  : await post(path, JSON.parse(opt?.body as string), {
                      headers: opt?.headers as Record<string, string>,
                    });
              return {
                json: async () => res.data,
              };
            }
            return new Promise(() => {});
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {!IS_PROD && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
