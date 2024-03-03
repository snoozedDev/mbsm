import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface ModalPropsMap {
  create_account: never;
  manage_account: { handle: string };
  edit_image: {
    inputId: string;
    allowHotspot: boolean;
    allowCrop: boolean;
    aspectRatio?: number;
  };
}

export type ModalType = {
  [K in keyof ModalPropsMap]: ModalPropsMap[K] extends never
    ? { id: K }
    : { id: K; props: ModalPropsMap[K] };
}[keyof ModalPropsMap];

export type ModalState = {
  modals: ModalType[];
};

const initialState: ModalState = {
  modals: [],
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    addModal: (state: ModalState, action: PayloadAction<ModalType>) => {
      if (state.modals.some((m) => m.id === action.payload.id)) {
        state.modals = state.modals.filter((m) => m.id !== action.payload.id);
      }
      state.modals.push(action.payload);
    },
    dismissModal: (state) => {
      state.modals.pop();
    },
  },
});

export const { addModal, dismissModal } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
