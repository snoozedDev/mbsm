"use client";

import { useTheme } from "next-themes";

export const ThemeManager = () => {
  const { setTheme, theme, systemTheme } = useTheme();

  return (
    <div className="flex flex-col">
      <span>theme: {theme}</span>
      <span>systemTheme: {systemTheme}</span>
      <button onClick={() => setTheme("system")}>set system</button>
      <button onClick={() => setTheme("dark")}>set dark</button>
      <button onClick={() => setTheme("light")}>set light</button>
    </div>
  );
};
