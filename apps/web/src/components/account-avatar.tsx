import { cn } from "@/lib/utils";
import { UserFacingAccount } from "@mbsm/types";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export const AccountAvatar = ({
  account,
  ...props
}: Omit<AvatarProps, "alt" | "src" | "fallback"> & {
  account: UserFacingAccount;
}) => (
  <AvatarPrimitive
    src={account.avatarUrl}
    alt={`Avatar for @${account.handle}`}
    fallback={account.handle.substring(0, 2)}
    {...props}
  />
);

type AvatarProps = {
  src?: string | null;
  alt: string;
  fallback: string;
  loading?: boolean;
  size: "sm" | "md" | "lg";
};

export const AvatarPrimitive = ({
  src,
  alt,
  fallback,
  loading,
  size,
}: AvatarProps) => {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sizePx = size === "sm" ? 40 : size === "md" ? 56 : 80;

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden flex items-center justify-center",
        size === "sm" ? "h-10 w-10" : size === "md" ? "h-14 w-14" : "h-20 w-20"
      )}
    >
      {loading ? (
        <Skeleton className="h-full w-full" />
      ) : src && !hasError ? (
        <>
          {!hasLoaded && <Skeleton className={cn("h-full w-full absolute")} />}
          <Image
            alt={alt}
            src={src}
            width={sizePx}
            height={sizePx}
            onLoad={() => setHasLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "object-cover w-full h-full",
              hasLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      ) : (
        <>
          <span
            className={cn(
              size === "sm"
                ? "text-lg"
                : size === "md"
                  ? "text-2xl"
                  : "text-3xl",
              "text-primary z-10"
            )}
          >
            {fallback}
          </span>
          <div className="absolute w-full h-full bg-muted" />
        </>
      )}
    </div>
  );
};
