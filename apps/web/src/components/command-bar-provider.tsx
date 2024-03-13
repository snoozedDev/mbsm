"use client";

import { createContext, useContext, useState } from "react";
import { CommandBar } from "./command-bar";

type CommandBarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommandBarContext = createContext<CommandBarContextValue>({
  open: false,
  setOpen: () => {},
});

export const useCommandBar = () => useContext(CommandBarContext);

export const CommandBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return (
    <CommandBarContext.Provider value={{ open, setOpen }}>
      <CommandBar />
      {children}
    </CommandBarContext.Provider>
  );
};
