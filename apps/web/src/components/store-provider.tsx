"use client";
import { store } from "@/redux/store";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    persistStore(store);
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
