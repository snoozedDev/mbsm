"use client";

import React, { Fragment, ReactElement, ReactNode, useState } from "react";

type ModalType = {
  id: string;
  renderElement: (props: { id: string }) => ReactElement;
};

type ModalContextType = {
  currentlyActiveModal: ModalType | undefined;
  modals: ModalType[];
  close: (id: string) => void;
  push: (
    renderElement: ModalType["renderElement"],
    id?: ModalType["id"]
  ) => void;
};

const ModalContext = React.createContext<ModalContextType>({
  close: () => {},
  push: () => {},
  modals: [],
  currentlyActiveModal: undefined,
});

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalType[]>([]);
  const currentlyActiveModal = modals[modals.length - 1];

  const close = (id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  };

  const push: ModalContextType["push"] = (renderElement, givenId) => {
    const id = givenId || Math.random().toString(36).substring(7);
    setModals((prev) => [
      ...prev.filter((m) => m.id !== id),
      { renderElement, id },
    ]);
  };

  return (
    <ModalContext.Provider
      value={{ push, close, modals, currentlyActiveModal }}
    >
      <>
        {modals.map((m) => (
          <Fragment key={m.id}>{m.renderElement({ id: m.id })}</Fragment>
        ))}
        {children}
      </>
    </ModalContext.Provider>
  );
};

export const useModals = () => React.useContext(ModalContext);
