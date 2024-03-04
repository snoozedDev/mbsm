"use client";
import { useCommandBar } from "./command-bar";
import { useIsDesktop } from "./hooks/isDesktop";
import { Button } from "./ui/button";

export const CommandShortcut = () => {
  const isDekstop = useIsDesktop();
  const { setOpen } = useCommandBar();
  if (!isDekstop) return null;

  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  const modifier = isMac ? "⌘" : "Ctrl";

  return (
    <Button
      variant="outline"
      className="text-sm flex items-center text-muted-foreground"
      onClick={() => setOpen(true)}
    >
      {modifier} + K
    </Button>
  );
};
