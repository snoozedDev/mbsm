import { useIsMounted } from "@/hooks/useIsMounted";
import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";
import { useIsDesktop } from "../hooks/isDesktop";

// OnlyRender Will only render its children if the mobile or desktop
// prop is true and the current viewport matches. It differs from
// RenderOnly in that it will render its children on first pass.
export const OnlyRender = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    at: "mobile" | "desktop";
  } & React.HTMLProps<HTMLDivElement>
>(function OnlyRender({ at, children, ...props }, ref) {
  const isMounted = useIsMounted();
  const isDesktop = useIsDesktop();
  const isAtBreakpoint = at === "desktop" ? isDesktop : !isDesktop;

  // Even though we are hiding this component with CSS, we still need to
  // return null here to avoid rendering the component and its children.
  // Otherwise, we might get undesired side effects affecting global state.
  if (isMounted && !isAtBreakpoint) return null;

  return (
    <OnlyDisplay ref={ref} desktop={at === "desktop"} {...props}>
      {children}
    </OnlyDisplay>
  );
});

const OnlyDisplay = forwardRef<
  HTMLDivElement,
  { desktop: boolean } & React.HTMLProps<HTMLDivElement>
>(function OnlyDisplay({ desktop, children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(className, desktop ? "max-md:hidden" : "md:hidden")}
      {...props}
    >
      {children}
    </div>
  );
});
