import React, { ReactNode } from "react";
import css from "./ContainerFocused.module.scss";

interface ContainerFocusedProps {
  children: ReactNode | ReactNode[];
}

export const ContainerFocused = ({ children }: ContainerFocusedProps) => {
  return (
    <div className={css.container}>
      <div className={css.child_container}>{children}</div>
    </div>
  );
};
