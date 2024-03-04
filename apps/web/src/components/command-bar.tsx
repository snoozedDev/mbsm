"use client";
import { useAccountSwitcher } from "@/hooks/useAccountSwitcher";
import {
  useSignInMutation,
  useSignOutMutation,
  useSignedInStatus,
} from "@/queries/authQueries";
import { useUserMeQuery } from "@/queries/userQueries";
import {
  Fingerprint,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserCircle,
  UserCog,
  UserPlus,
  Users,
  Users2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useModals } from "./modals-layer";
import { CreateAccountModal } from "./modals/CreateAccountModal";
import { ManageAccountModal } from "./modals/ManageAccountModal";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Skeleton } from "./ui/skeleton";

type CommandBarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CommandBarContext = createContext<CommandBarContextValue>({
  open: false,
  setOpen: () => {},
});

export const useCommandBar = () => useContext(CommandBarContext);

export const CommandBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { push } = useModals();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();
  const signIn = useSignInMutation();
  const signOut = useSignOutMutation();
  const { isSignedIn, isPending: isSignedInLoading } = useSignedInStatus();
  const { data, isLoading: userMeLoading } = useUserMeQuery();
  const {
    onSwitchActiveAccount,
    activeAccount,
    isLoading: accountSwitcherLoading,
  } = useAccountSwitcher();
  const inputRef = useRef<HTMLInputElement>(null);

  const inactiveAccounts = data?.accounts?.filter(
    (account) => account.handle !== activeAccount?.handle
  );

  const isLoading = useMemo(
    () => accountSwitcherLoading || userMeLoading || isSignedInLoading,
    [accountSwitcherLoading, userMeLoading, isSignedInLoading]
  );

  const doAndClose = (cb: () => void) => () => {
    cb();
    setOpen(false);
  };

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

  useEffect(() => {
    if (!isLoading && open) inputRef.current?.focus();
  }, [isLoading, open]);

  return (
    <CommandBarContext.Provider value={{ open, setOpen }}>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          disabled={isLoading}
          ref={inputRef}
          placeholder="Type a command or search..."
        />
        <CommandEmpty>No results found.</CommandEmpty>
        {isLoading ? (
          <div className="grid gap-4 p-4">
            {new Array(3).fill(null).map((_, i) => (
              <Skeleton className="h-6 w-full" key={i} />
            ))}
          </div>
        ) : (
          <CommandList>
            {/* <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator /> */}
            <CommandGroup heading="Authentication">
              {!isSignedIn && (
                <CommandItem onSelect={doAndClose(signIn.requestSignIn)}>
                  <LogIn className="mr-2" />
                  Sign in
                </CommandItem>
              )}
              {!isSignedIn && (
                <CommandItem
                  onSelect={doAndClose(() => router.push("/auth/signup"))}
                >
                  <UserPlus className="mr-2" />
                  Sign up
                </CommandItem>
              )}
              {isSignedIn && (
                <CommandItem onSelect={doAndClose(signOut.mutate)}>
                  <LogOut className="mr-2" />
                  Sign out
                </CommandItem>
              )}
            </CommandGroup>
            {isSignedIn && (
              <CommandGroup heading="Settings">
                <CommandItem
                  onSelect={doAndClose(() => router.push("/settings/user"))}
                >
                  <UserCircle className="mr-2" />
                  User
                </CommandItem>
                <CommandItem
                  onSelect={doAndClose(() => router.push("/settings/security"))}
                >
                  <Fingerprint className="mr-2" />
                  Security
                </CommandItem>
                <CommandItem
                  onSelect={doAndClose(() => router.push("/settings/accounts"))}
                >
                  <Users className="mr-2" />
                  Accounts
                </CommandItem>
              </CommandGroup>
            )}
            {isSignedIn && (
              <CommandGroup heading="Accounts">
                {activeAccount && (
                  <CommandItem
                    onSelect={doAndClose(() =>
                      push(({ id }) => (
                        <ManageAccountModal
                          id={id}
                          handle={activeAccount.handle}
                        />
                      ))
                    )}
                  >
                    <UserCog className="mr-2" />
                    <span>Manage active account</span>
                  </CommandItem>
                )}
                {inactiveAccounts?.map((account) => (
                  <CommandItem
                    onSelect={doAndClose(() =>
                      onSwitchActiveAccount(account.handle)
                    )}
                    key={account.handle}
                  >
                    <Users2 className="mr-2" />

                    {`Switch to @${account.handle}`}
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={doAndClose(() =>
                    push(({ id }) => <CreateAccountModal id={id} />)
                  )}
                >
                  <UserPlus className="mr-2" />
                  Create new account
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup heading="Theme">
              <CommandItem onSelect={doAndClose(() => setTheme("dark"))}>
                <Moon className="mr-2" />
                Dark
              </CommandItem>
              <CommandItem onSelect={doAndClose(() => setTheme("system"))}>
                <Monitor className="mr-2" />
                System
              </CommandItem>
              <CommandItem onSelect={doAndClose(() => setTheme("light"))}>
                <Sun className="mr-2" />
                Light
              </CommandItem>
            </CommandGroup>
          </CommandList>
        )}
      </CommandDialog>
      {children}
    </CommandBarContext.Provider>
  );
};
