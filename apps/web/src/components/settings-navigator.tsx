"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsDesktop } from "./hooks/isDesktop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export const SettingsNavigator = ({
  values,
  value,
}: {
  values: string[];
  value: string;
}) => {
  const router = useRouter();
  const isDekstop = useIsDesktop();

  return (
    <aside className="flex h-full items-stretch max-md:flex-1 md:max-w-[250px] w-full self-start max-md:mb-4">
      <div className="flex-1 flex">
        {isDekstop ? (
          <Tabs value={value} className="flex-1">
            <TabsList className="md:flex-col md:space-y-2 md:h-auto md:items-stretch w-full justify-start max-md:overflow-x-scroll max-md:no-scrollbar md:bg-background">
              {values.map((page) => (
                <TabsTrigger
                  key={page}
                  value={page}
                  asChild
                  className="hover:bg-muted/50 data-[state=active]:font-medium md:data-[state=active]:bg-muted md:data-[state=active]:text-foreground"
                >
                  <Link
                    key={page}
                    href={`/settings/${page}`}
                    className="text-base md:justify-start md:py-2"
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <Select
            value={value}
            onValueChange={(v) => router.push(`/settings/${v}`)}
          >
            <SelectTrigger className="text-lg h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {values.map((page) => (
                <SelectItem className="text-lg" key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </aside>
  );
};
