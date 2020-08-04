import React, { ReactNode } from "react";
import css from "./Modal.module.scss";
import cn from "classnames";

interface ModalProps {
  showModal: boolean;
  onHideModal: () => void;
  renderButton: () => ReactNode;
  renderModal: (onHideModal: () => void) => ReactNode;
}

export const Modal = ({
  showModal,
  renderButton,
  renderModal,
  onHideModal,
}: ModalProps) => {
  return (
    <>
      <div className={cn(css.modal_container, showModal && css.visible)}>
        <div className={css.modal}>{renderModal(onHideModal)}</div>
        <div className={css.backdrop} onClick={onHideModal} />
      </div>
      {renderButton()}
    </>
  );
};
