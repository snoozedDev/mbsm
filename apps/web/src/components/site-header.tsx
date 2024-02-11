"use client";
import { cn } from "@/lib/utils";
import {
  useIsLoggedIn,
  useLoginMutation,
  useLogoutMutation,
} from "@/queries/authQueries";
import { useUserMeQuery } from "@/queries/userQueries";
import { AlertTriangle, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useIsEmailVerified } from "./hooks/useIsEmailVerified";
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
  const login = useLoginMutation();
  const { data: user, isLoading: authLoading } = useUserMeQuery();
  const { mutate: logOut } = useLogoutMutation();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  const emailVerified = useIsEmailVerified();

  const hasWarnings = emailVerified === false;

  const onLogin = () => {
    login.mutate();
  };

  const onRegister = () => {
    router.push("/auth/register");
  };

  const isLoading = authLoading || login.isPending;

  return (
    <header className="supports-backdrop-blur:bg-background/80 sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="px-4 flex h-16 items-center max-w-5xl container">
        <h1 className="text-xl font-bold select-none max-sm:hidden mr-4">
          MBSM
        </h1>
        {JSON.stringify({ user })}
        <NavigationMenu className="max-xs:hidden">
          <NavigationMenuList className="space-x-4 px-4 font-medium">
            {navigation.map(({ name, href }, i) => (
              <NavigationMenuItem
                key={name}
                className={cn(
                  "transition-colors",
                  pathname === href
                    ? ""
                    : "text-foreground/40 hover:text-foreground"
                )}
              >
                <Link href={href} className="py-2 px-4 text-sm">
                  {name}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex-grow" />
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative">
                {hasWarnings && (
                  <span className="absolute flex h-3 w-3 -right-1 -top-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
                  </span>
                )}
                <SettingsIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="flex flex-col items-stretch"
            >
              <DropdownMenuLabel>No account selected</DropdownMenuLabel>
              {hasWarnings && <DropdownMenuSeparator />}
              {emailVerified === false && (
                <DropdownMenuItem asChild>
                  <Link
                    href={"/auth/verify"}
                    className="hover:cursor-pointer text-warning"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span className="ml-2">Email Unverified</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={"/settings/user"} className="hover:cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={() => logOut()}
                  className="hover:cursor-pointer"
                >
                  Log Out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-4">
            <Button onClick={onLogin} variant="outline">
              LOG IN
            </Button>
            <Button onClick={onRegister} variant="outline">
              SIGN UP
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
