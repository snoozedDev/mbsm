import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
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
