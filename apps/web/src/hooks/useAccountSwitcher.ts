"use client";
import { useUserMeQuery } from "@/queries/userQueries";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { switchActiveAccount } from "@/redux/slices/sessionPerfsSlice";
import { useCallback } from "react";
import { toast } from "sonner";

export const useAccountSwitcher = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useUserMeQuery();
  const activeAccountHandle = useAppSelector(
    (s) => s.sessionPerfs.activeAccount
  );
  const activeAccount = data?.accounts?.find(
    (a) => a.handle === activeAccountHandle
  );

  const onSwitchActiveAccount = useCallback(
    (handle: string) => {
      if (isLoading || !data) {
        toast("Please wait for the account to load");
        return;
      }

      const account = data.accounts?.find((a) => a.handle === handle);

      if (!account) {
        toast("Account not found");
      } else {
        dispatch(switchActiveAccount(account));
        toast("Account switched", {
          duration: 2000,
          description: `You are
          now using the account @${account.handle}`,
        });
      }
    },
    [dispatch, isLoading, data]
  );

  return {
    activeAccount,
    isLoading,
    onSwitchActiveAccount,
  };
};
