"use client";

import { useAppSelector } from "@/redux/hooks";
import type { ModalType } from "@/redux/slices/modalSlice";
import { CreateAccountModal } from "./modals/CreateAccountModal";
import { EditImageModal } from "./modals/EditImageModal";
import { ManageAccountModal } from "./modals/ManageAccountModal";

export const ModalsLayer = () => {
  const modals = useAppSelector((s) => s.modal.modals);

  return modals.map((modal, i) => (
    <ModalMapper key={`${modal.id}-${i}`} modal={modal} />
  ));
};

const ModalMapper = ({ modal }: { modal: ModalType }) => {
  switch (modal.id) {
    case "create_account":
      return <CreateAccountModal />;
    case "manage_account":
      return <ManageAccountModal {...modal.props} />;
    case "edit_image":
      return <EditImageModal {...modal.props} />;
    default:
      return null;
  }
};
