"use client";
import { useAccountSwitcher } from "@/hooks/useAccountSwitcher";
import { useUserMeQuery } from "@/queries/userQueries";
import { useAppDispatch } from "@/redux/hooks";
import { addModal } from "@/redux/slices/modalSlice";
import { useEffect, useState } from "react";
import { AccountAvatar } from "./account-avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

export const CommandBar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { data } = useUserMeQuery();
  const { onSwitchActiveAccount, activeAccount } = useAccountSwitcher();

  const inactiveAccounts = data?.accounts?.filter(
    (account) => account.handle !== activeAccount?.handle
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {/* <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator /> */}
        <CommandGroup heading="Settings">
          {activeAccount && (
            <CommandItem>
              {`Open settings for ${activeAccount.handle}`}
              <AccountAvatar
                className="ml-2 h-6 w-6 text-xs"
                account={activeAccount}
              />
            </CommandItem>
          )}
        </CommandGroup>
        <CommandGroup heading="Accounts">
          {inactiveAccounts?.map((account) => (
            <CommandItem
              onSelect={() => {
                onSwitchActiveAccount(account.handle);
                setOpen(false);
              }}
              key={account.handle}
            >
              {`Switch to ${account.handle}`}
              <AccountAvatar
                className="ml-2 h-6 w-6 text-xs"
                account={account}
              />
            </CommandItem>
          ))}
          <CommandItem
            onSelect={() => {
              dispatch(
                addModal({
                  id: "create_account",
                })
              );
              setOpen(false);
            }}
          >
            Create new account
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
