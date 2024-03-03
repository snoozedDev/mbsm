import { UserAccount } from "@mbsm/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { toast } from "sonner";
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
      toast("Account switched", {
        duration: 2000,
        description: `You are
        now using the account @${action.payload.handle}`,
        icon: action.payload.avatar?.url,
      });
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
