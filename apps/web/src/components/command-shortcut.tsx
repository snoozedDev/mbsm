"use client";

import { useIsMounted } from "@/hooks/useIsMounted";
import { useCommandBar } from "./command-bar-provider";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export const CommandShortcut = () => {
  const { setOpen } = useCommandBar();
  const isMounted = useIsMounted();

  const isMac =
    typeof window === "undefined" ||
    /Mac|iPod|iPhone|iPad/.test(navigator?.userAgent);

  const modifier = isMac ? "⌘" : "Ctrl";

  if (!isMounted) return <Skeleton className="h-10 w-20 max-sm:hidden" />;

  return (
    <Button
      variant="outline"
      className={
        "text-sm flex items-center text-muted-foreground max-sm:hidden"
      }
      onClick={() => setOpen(true)}
    >
      {modifier} + K
    </Button>
  );
};
