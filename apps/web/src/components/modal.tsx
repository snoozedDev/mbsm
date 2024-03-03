import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dismissModal, type ModalType } from "@/redux/slices/modalSlice";
import { useEffect, useState } from "react";
import { useIsDesktop } from "./hooks/isDesktop";
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

export const Modal = <T extends ModalType["id"]>({
  id,
  renderContent,
  description,
  title,
  shouldClose,
  dismissable,
}: {
  id: T;
  title?: string;
  description?: string;
  shouldClose?: boolean;
  renderContent: (args: { close: () => void }) => React.JSX.Element;
  dismissable?: boolean;
}) => {
  const modals = useAppSelector((s) => s.modal.modals);
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const isDesktop = useIsDesktop();

  const selfIndex = modals.findIndex((m) => m.id === id);
  const isLast = selfIndex === modals.length - 1;

  const Wrapper = isDesktop ? Dialog : Drawer;
  const Content = isDesktop ? DialogContent : DrawerContent;
  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitle;
  const Description = isDesktop ? DialogDescription : DrawerDescription;

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        dispatch(dismissModal());
      }, 250);
    }
  }, [open]);

  useEffect(() => {
    if (shouldClose) setOpen(false);
  }, [shouldClose]);

  return (
    <Wrapper open={open} onOpenChange={setOpen} dismissible={dismissable}>
      <Content
        onFocusOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <Header>
          {title && <Title className="mb-4 text-2xl">{title}</Title>}
          {description && (
            <Description className="text-base text-center">
              {description}
            </Description>
          )}
          {renderContent({ close: () => setOpen(false) })}
        </Header>
      </Content>
    </Wrapper>
  );
};
