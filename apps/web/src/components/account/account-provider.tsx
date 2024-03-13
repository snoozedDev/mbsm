"use client";
import { UserAccount } from "@mbsm/types";
import { createContext } from "react";

type AccountLayoutContext = {
  account?: UserAccount;
};

export const AccountLayoutContext = createContext<AccountLayoutContext>({});

export const AccountLayoutProvider = ({
  account,
  children,
}: {
  account: UserAccount;
  children: React.ReactNode;
}) => {
  return (
    <AccountLayoutContext.Provider value={{ account }}>
      {children}
    </AccountLayoutContext.Provider>
  );
};
