import { useCommandBar } from "./command-bar-provider";
import { Button } from "./ui/button";

export const CommandShortcut = () => {
  const { setOpen } = useCommandBar();

  const isMac =
    typeof window === "undefined" ||
    /Mac|iPod|iPhone|iPad/.test(navigator?.userAgent);

  const modifier = isMac ? "⌘" : "Ctrl";

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
