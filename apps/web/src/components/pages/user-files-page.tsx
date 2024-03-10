"use client";
import { useUserMeQuery, useUserSettingsQuery } from "@/queries/userQueries";
import { FileSchema } from "@mbsm/types";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { FadeFromBelow } from "../containers/fade-from-below";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

const fileSorts = [
  {
    value: "date",
    label: "Sort by newest",
  },
  {
    value: "size",
    label: "Sort by biggest",
  },
];

export const UserFilesPage = () => {
  const { data: user } = useUserMeQuery();
  const { data: settings } = useUserSettingsQuery();
  const [sort, setSort] = useState(fileSorts[0].value);

  const fileSorter = useCallback(
    (a: z.infer<typeof FileSchema>, b: z.infer<typeof FileSchema>) => {
      switch (sort) {
        case "date":
          return (
            DateTime.fromISO(b.createdAt, { zone: "utc" }).toMillis() -
            DateTime.fromISO(a.createdAt, { zone: "utc" }).toMillis()
          );
        case "size":
          return b.sizeKB - a.sizeKB;
      }
      return 0;
    },
    [sort]
  );

  const percent = useMotionValue(0);
  const width = useMotionTemplate`${percent}%`;
  const percentRef = useRef<HTMLSpanElement>(null);
  const kbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const percentNode = percentRef.current;
    const kbNode = kbRef.current;
    if (!settings || !user || !percentNode || !kbNode) return;
    const usedKB = settings.files.reduce((acc, file) => acc + file.sizeKB, 0);
    const to = Math.round((usedKB / user.maxStorageMB / 1024) * 100);

    const percentAnim = animate(percent, to, {
      duration: 1,
      ease: "easeOut",
      onUpdate(value) {
        percentNode.textContent = `${value.toFixed(0)}%`;
      },
    });
    const kbAnim = animate(0, usedKB, {
      duration: 1,
      ease: "easeOut",
      onUpdate(value) {
        kbNode.textContent = `${humanFileSize(value * 1024)} / ${humanFileSize(
          user.maxStorageMB * 1024 * 1024
        )}`;
      },
    });

    return () => {
      percentAnim.stop();
      kbAnim.stop();
    };
  }, [settings, user]);

  return (
    <FadeFromBelow className="@container">
      <Card className="px-6 py-4 mb-4">
        <h2 className="text-2xl font-medium tracking-wide">Storage</h2>
        <fieldset className="text-sm text-muted-foreground mt-2 mb-6 space-y-2">
          <p>{`You have a maximum amount of storage available to you.`}</p>
          <p>
            {`When you reach the limit, you won't be able to upload any more files
            until you delete some. Storage is shared across all your accounts.
            It is not possible to increase the limit at this time, but it may be
            possible in the future.`}
          </p>
          <p>
            {`Storage and bandwidth are one of the most obscurely priced
            resources. I'll be monitoring usage to see if the current limits are
            fair and will adjust them accordingly.`}
          </p>
        </fieldset>
        <div className="w-full flex flex-col">
          <div className="flex justify-between mb-1 tracking-wide">
            <span>Storage used</span>
            <span>
              <span ref={percentRef} />
            </span>
          </div>
          <div className="w-full h-6 rounded-md overflow-hidden bg-muted border">
            <motion.div
              className="h-full bg-foreground"
              style={{
                width,
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground self-end mt-1">
            <span ref={kbRef}>MB / MB</span>
          </span>
        </div>
      </Card>
      <div className="py-4">
        <h2 className="text-2xl font-medium tracking-wide">Files</h2>
        <fieldset className="text-sm text-muted-foreground mt-2 mb-4 space-y-2">
          <p>{`These are the files that you have uploaded to the site.`}</p>
          <p>
            {`They all contribute to your storage limit. The system won't let you
            delete files that are in use and will inform about what is using
            them.`}
          </p>
        </fieldset>
        <Separator />
        <div className="mt-4 flex justify-end">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {fileSorts.map((sort) => (
                <SelectItem key={sort.value} value={sort.value}>
                  {sort.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-3 gap-4">
          {settings?.files
            .sort(fileSorter)
            .map((file) => <SingleFile key={file.id} file={file} />)}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </FadeFromBelow>
  );
};

const SingleFile = ({ file }: { file: z.infer<typeof FileSchema> }) => {
  const { data } = useUserMeQuery();
  const account = useMemo(() => {
    if (!file.metadata || !data) return undefined;
    const { metadata } = file;
    switch (metadata.type) {
      case "avatar":
        return data.accounts.find((a) => a.id === metadata.accountId);
    }
    return undefined;
  }, [data, file]);

  const getTitle = () => {
    if (!file.metadata) return "File";
    switch (file.metadata.type) {
      case "avatar":
        if (account) return `Avatar for @${account.handle}`;
        return "Avatar";
      default:
        return "File";
    }
  };

  const renderImage = () => {
    if (!file.url || !file.metadata) return null;
    const { metadata } = file;
    switch (metadata.type) {
      case "avatar":
        const account = data?.accounts.find((a) => a.id === metadata.accountId);
        return (
          <Image
            className="object-contain h-full w-full"
            src={file.url}
            alt={`Avatar for @${account?.handle}`}
            width={200}
            height={200}
          />
        );

      default:
        break;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <div className="pt-1 px-1 border-b">
        <div className="rounded-t-lg h-28 w-full bg-gradient-to-t to-muted/50 from-background">
          {renderImage()}
        </div>
      </div>
      <div className="py-4 px-2 flex">
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-medium tracking-wide">{getTitle()}</h3>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground mt-2">
              {file.sizeKB} KB |{" "}
              {DateTime.fromISO(file.createdAt, { zone: "utc" }).toRelative()}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="flex flex-col items-stretch"
          >
            <DropdownMenuItem onSelect={() => console.log("delete")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
