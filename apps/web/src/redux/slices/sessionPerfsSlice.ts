import { UserAccount } from "@mbsm/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { storage } from "../storage";

export type SessionPerfsState = {
  activeAccount?: string;
};

const initialState: SessionPerfsState = {};

export const sessionPerfsSlice = createSlice({
  name: "sessionPerfs",
  initialState: initialState as SessionPerfsState,
  reducers: {
    switchActiveAccount: (state, action: PayloadAction<UserAccount>) => {
      state.activeAccount = action.payload.handle;
    },
  },
  extraReducers: (builder) => builder,
});

export const { switchActiveAccount } = sessionPerfsSlice.actions;

export const sessionPerfsReducer = persistReducer(
  {
    key: "sessionPerfs",
    storage,
    whitelist: ["activeAccount"],
  },
  sessionPerfsSlice.reducer
);
