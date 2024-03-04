import { CommandShortcut } from "./command-shortcut";
import { ThemeSwitcher } from "./theme-switcher";

export const Footer = () => {
  return (
    <footer className="py-4 md:px-8 md:py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          built by me © {new Date().getFullYear()}
        </p>

        <div className="flex space-x-4">
          <CommandShortcut />
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
};
