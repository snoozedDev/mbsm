"use client";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

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
      <ToggleGroupItem value="dark">D</ToggleGroupItem>
      <ToggleGroupItem value="system">S</ToggleGroupItem>
      <ToggleGroupItem value="light">L</ToggleGroupItem>
    </ToggleGroup>
  );
};
