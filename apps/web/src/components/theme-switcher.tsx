"use client";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const isServer = typeof window === "undefined";

export const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();

  const currentTheme = isServer ? "system" : theme;

  const onChangeTheme = (newTheme: string) => {
    if (newTheme === "") return;
    setTheme(newTheme);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={currentTheme}
      onValueChange={onChangeTheme}
    >
      <ToggleGroupItem
        value="dark"
        className={cn(currentTheme === "dark" && "bg-accent")}
      >
        <Moon className="h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        className={cn(currentTheme === "system" && "bg-accent")}
      >
        <Monitor className="h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="light"
        className={cn(currentTheme === "light" && "bg-accent")}
      >
        <Sun className="h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
