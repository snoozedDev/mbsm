"use client";

import { useContext } from "react";
import { AccountLayoutContext } from "./account-provider";

export const AccountPage = ({}: {}) => {
  const { account } = useContext(AccountLayoutContext);
  return <div>{account?.handle}</div>;
};
