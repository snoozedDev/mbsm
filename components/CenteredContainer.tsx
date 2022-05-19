import { ReactNode } from "react";

export const CenteredContainer = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => (
  <div className="bg-nord6 dark:bg-nord0 top-0 left-0 right-0 bottom-0 absolute flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);
