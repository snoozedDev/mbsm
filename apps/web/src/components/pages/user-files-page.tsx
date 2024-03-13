"use client";
import { useUserMeQuery, useUserSettingsQuery } from "@/queries/userQueries";
import { FileSchema } from "@mbsm/types";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { Info, MoreHorizontal } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { FadeFromBelow } from "../containers/fade-from-below";
import { useModals } from "../modals-layer";
import { InfoModal } from "../modals/InfoModal";
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
import { Skeleton } from "../ui/skeleton";

function humanFileSize({
  bytes,
  si = false,
  dp = 1,
}: {
  bytes: number;
  si?: boolean;
  dp?: number;
}) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes.toFixed(dp) + " B";
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
  const { data: user, isLoading: userLoading } = useUserMeQuery();
  const { data: settings, isLoading: settingsLoading } = useUserSettingsQuery();
  const { push } = useModals();
  const [sort, setSort] = useState(fileSorts[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const pages = useMemo(
    () => Math.ceil((settings?.files.length ?? 0) / perPage),
    [settings]
  );

  const isLoading = userLoading || settingsLoading;

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
        kbNode.textContent = `${humanFileSize({ bytes: value * 1024 })} / ${humanFileSize(
          { bytes: user.maxStorageMB * 1024 * 1024 }
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
        <h2 className="text-2xl font-medium tracking-wide flex items-center">
          <span>Storage</span>
          <Button
            size="icon"
            variant="ghost"
            className="ml-2"
            onClick={() =>
              push(({ id }) => (
                <InfoModal id={id} title="About Storage">
                  <fieldset className="text-base mb-6 text-foreground/80 space-y-3">
                    <p>
                      {`You have a certain amount of storage available to you, which will grow as your
                        accounts age.`}
                    </p>
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
                </InfoModal>
              ))
            }
          >
            <Info className="h-5 w-5" />
          </Button>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6 space-y-2">{`You can keep track of your used storage here.`}</p>
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
          <p>
            {`Unused files will eventually get deleted by an automated system.`}
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
          {isLoading
            ? [...Array(9).keys()].map((i) => <LoadingFile key={i} />)
            : settings?.files
                .sort(fileSorter)
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((file) => <SingleFile key={file.id} file={file} />)}
        </div>
      </div>
      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => setCurrentPage((p) => p - 1)}
                />
              </PaginationItem>
            )}
            {Array.from({ length: pages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < pages && (
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => setCurrentPage((p) => p + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </FadeFromBelow>
  );
};

const LoadingFile = () => {
  return (
    <Card className="overflow-hidden">
      <div className="pt-1 px-1 border-b">
        <div className="rounded-t-lg h-28 w-full bg-gradient-to-t to-muted/50 from-background" />
      </div>
      <div className="py-4 px-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
    </Card>
  );
};

const SingleFile = ({ file }: { file: z.infer<typeof FileSchema> }) => {
  const getTitle = () => {
    const { metadata } = file;
    if (!metadata) return "File";
    switch (metadata.type) {
      case "avatar":
        return "Avatar";
      default:
        return "File";
    }
  };

  const renderImage = () => {
    const { metadata } = file;
    if (!metadata || !file.url) return null;
    switch (metadata.type) {
      case "avatar":
        return (
          <Image
            className="object-contain h-full w-full"
            src={file.url}
            alt={`Avatar image`}
            width={200}
            height={200}
          />
        );

      default:
        break;
    }
    return null;
  };

  const download = (url: string) => {
    if (!url) {
      throw new Error("Resource URL not provided! You need to provide one");
    }
    const a = document.createElement("a");
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        a.href = blobURL;
        a.download = "";
        a.style.display = "none";
        document.body.appendChild(a);

        a.click();
      })
      .finally(() => {
        document.body.removeChild(a);
      });
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
              {humanFileSize({ bytes: file.sizeKB * 1024 })} |{" "}
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
          <DropdownMenuContent side="bottom" align="end">
            {file.url && (
              <DropdownMenuItem asChild>
                <Link href={file.url} target="_blank">
                  View file
                </Link>
              </DropdownMenuItem>
            )}
            {file.url && (
              <DropdownMenuItem onSelect={() => download(file.url ?? "")}>
                Download file
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => console.log("delete")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
