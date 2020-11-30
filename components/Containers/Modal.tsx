import cn from "classnames";
import React, { ReactNode } from "react";
import css from "./Modal.module.scss";

interface ModalProps {
  showModal: boolean;
  onHideModal: () => void;
  renderModal: (onHideModal: () => void) => ReactNode;
  renderButton?: () => ReactNode;
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
        {showModal && (
          <>
            <div className={css.modal}>{renderModal(onHideModal)}</div>
            <div className={css.backdrop} onClick={onHideModal} />
          </>
        )}
      </div>
      {renderButton && renderButton()}
    </>
  );
};
