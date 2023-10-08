"use client";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 1000 * 5, // 5 seconds
      cacheTime: 1000 * 20, // 20 seconds
    },
  },
});

// const localStoragePersister = IS_SERVER
//   ? undefined
//   : createSyncStoragePersister({
//       storage: window.localStorage,
//     });
// // const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

// localStoragePersister &&
//   persistQueryClient({
//     queryClient,
//     maxAge: 1000 * 10,
//     persister: localStoragePersister,
//   });
