"use client";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  const onChangeTheme = (newTheme: string) => {
    if (newTheme === "") return;
    setTheme(newTheme);
  };

  const currentTheme = useMemo(() => {
    return mounted ? theme : undefined;
  }, [theme, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={currentTheme}
      onValueChange={onChangeTheme}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="dark"
            className={cn(currentTheme === "dark" && "bg-accent")}
          >
            <Moon className="h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Dark Theme</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="system"
            className={cn(currentTheme === "system" && "bg-accent")}
          >
            <Monitor className="h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>System Theme</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="light"
            className={cn(currentTheme === "light" && "bg-accent")}
          >
            <Sun className="h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          <p>Light Theme</p>
        </TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
};
