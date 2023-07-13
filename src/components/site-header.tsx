"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="px-4 flex h-14 items-center max-w-5xl container">
        <h1 className="text-xl font-bold select-none max-sm:hidden mr-4">
          MBSM
        </h1>
        <NavigationMenu>
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
      </div>
    </header>
  );
};
