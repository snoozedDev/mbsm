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
      <Wrapper open={open} onOpenChange={setOpen} dismissible={dismissable}>
        <ContentWrapper
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className={cn("px-6 pb-6 flex flex-col items-stretch")}
        >
          <Header>
            {title && <Title className="mb-4 text-2xl">{title}</Title>}
            {description && (
              <Description className="text-base text-center">
                {description}
              </Description>
            )}
          </Header>
          <div>
            <portals.OutPortal node={portalNode} />
          </div>
        </ContentWrapper>
      </Wrapper>
    </>
  );
};
