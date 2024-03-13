import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useMemo, useState } from "react";
import * as portals from "react-reverse-portal";
import { useIsDesktop } from "./hooks/isDesktop";
import { useModals } from "./modals-layer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

export const Modal = ({
  id,
  children,
  description,
  shouldClose,
  dismissable,
  title,
}: {
  id: string;
  title?: string;
  description?: string;
  shouldClose?: boolean;
  dismissable?: boolean;
  children: ReactNode;
}) => {
  const { close } = useModals();
  const portalNode = useMemo(() => portals.createHtmlPortalNode(), []);
  const [open, setOpen] = useState(true);
  const isDesktop = useIsDesktop();

  const Wrapper = isDesktop ? Dialog : Drawer;
  const ContentWrapper = isDesktop ? DialogContent : DrawerContent;
  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitle;
  const Description = isDesktop ? DialogDescription : DrawerDescription;

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        close(id);
      }, 250);
    }
  }, [open]);

  useEffect(() => {
    if (shouldClose) setOpen(false);
  }, [shouldClose]);

  return (
    <>
      <portals.InPortal node={portalNode}>{children}</portals.InPortal>
      <Wrapper
        open={Boolean(open)}
        onClose={() => {}}
        onOpenChange={setOpen}
        dismissible={dismissable}
      >
        <ContentWrapper
          className={cn("p-0 overflow-hidden flex flex-col items-stretch")}
          {...(dismissable
            ? {
                onEscapeKeyDown: () => setOpen(false),
              }
            : {
                hideX: true,
                onFocusOutside: (e) => e.preventDefault(),
                onInteractOutside: (e) => e.preventDefault(),
                onPointerDownOutside: (e) => e.preventDefault(),
                onEscapeKeyDown: (e) => e.preventDefault(),
              })}
        >
          {(title || description) && (
            <Header>
              {title && <Title className="text-2xl">{title}</Title>}
              {description && (
                <Description className="text-base text-center mt-4">
                  {description}
                </Description>
              )}
            </Header>
          )}
          <div
            className={cn(
              "overflow-y-auto px-6 py-6",
              dismissable && (isDesktop ? "pt-12" : "pt-16"),
              isDesktop ? "max-h-[60vh]" : "max-h-[60vh]"
            )}
          >
            <portals.OutPortal node={portalNode} />
          </div>
        </ContentWrapper>
      </Wrapper>
    </>
  );
};
