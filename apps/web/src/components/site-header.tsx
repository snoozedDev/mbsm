"use client";
import { useAccountSwitcher } from "@/hooks/useAccountSwitcher";
import { cn } from "@/lib/utils";
import { useSignInMutation, useSignOutMutation } from "@/queries/authQueries";
import { useUserMeQuery } from "@/queries/userQueries";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountAvatar, AvatarPrimitive } from "./account-avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "FAQ",
    href: "/faq",
  },
];

export const SiteHeader = () => {
  const pathname = usePathname();
  const user = useUserMeQuery();
  const signIn = useSignInMutation();
  const signOut = useSignOutMutation();
  const { activeAccount } = useAccountSwitcher();

  const isLoading = signIn.isLoading || user.isPending;

  return (
    <header className="supports-backdrop-blur:bg-background/80 sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="p-4 flex items-center container">
        <h1 className="text-xl font-bold select-none max-sm:hidden mr-4">
          MBSM
        </h1>
        <NavigationMenu className="max-xs:hidden">
          <NavigationMenuList className="space-x-4 px-4 font-medium">
            {navigation.map(({ name, href }, i) => (
              <NavigationMenuItem key={name} asChild>
                <Button
                  className={cn(
                    pathname === href
                      ? ""
                      : "text-foreground/40 hover:text-foreground"
                  )}
                  variant="ghost"
                  asChild
                >
                  <Link href={href}>{name}</Link>
                </Button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex-grow" />
        {isLoading ? (
          <AvatarPrimitive
            fallback="L"
            size="sm"
            loading
            alt="Loading Avatar"
          />
        ) : user.data ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {activeAccount ? (
                <Button variant="ghost" className="p-0">
                  <AccountAvatar account={activeAccount} size="sm" />
                </Button>
              ) : (
                <Button variant="outline" className="relative">
                  {/* {hasWarnings && (
                  <span className="absolute flex h-3 w-3 -right-1 -top-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
                  </span>
                )} */}
                  <SettingsIcon />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="flex flex-col items-stretch"
            >
              {activeAccount ? (
                <></>
              ) : (
                <DropdownMenuLabel>No account selected</DropdownMenuLabel>
              )}
              {/* {hasWarnings && <DropdownMenuSeparator />} */}
              {/* {emailVerified === false && (
                <DropdownMenuItem asChild>
                  <Link
                    href={"/auth/verify"}
                    className="hover:cursor-pointer text-warning"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span className="ml-2">Email Unverified</span>
                  </Link>
                </DropdownMenuItem>
              )} */}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={"/settings/user"} className="hover:cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={() => signOut.mutate()}
                  className="hover:cursor-pointer"
                >
                  Log Out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-4">
            <Button onClick={() => signIn.requestSignIn()} variant="outline">
              LOG IN
            </Button>
            <Button asChild variant="outline">
              <Link href={"/auth/signup"}>SIGN UP</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
