import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type Modal = {
  id: string;
  Component: React.FC;
};

export type ModalState = {
  modals: Modal[];
};

const initialState: ModalState = {
  modals: [],
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    addModal: (state, action: PayloadAction<Omit<Modal, "id">>) => {
      const newModal = { ...action.payload, id: Math.random().toString() };
      state.modals.push(newModal);
    },
    dismissModal: (state) => {
      state.modals.shift();
    },
  },
});

export const { addModal, dismissModal } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
