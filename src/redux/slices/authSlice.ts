import { LoginVerifyData } from "@/pages/api/auth/login/verify";
import { RegisterVerifyData } from "@/pages/api/auth/register/verify";
import { AuthUserData } from "@/pages/api/auth/user";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../actions/authActions";

export type AuthState = {
  loading: boolean;
  error?: string;
  user?: {
    username: string;
    authenticators: string[];
  };
};

const initialState: AuthState = {
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState as AuthState,
  reducers: {},
  extraReducers: {
    [loginUser.pending.type]: (state) => {
      state.loading = true;
      state.error = undefined;
    },
    [loginUser.fulfilled.type]: (
      state,
      action: PayloadAction<Required<LoginVerifyData>>
    ) => {
      state.loading = false;
    },
    [loginUser.rejected.type]: (state, action) => {
      state.loading = false;
    },
    [registerUser.pending.type]: (state) => {
      state.loading = true;
      state.error = undefined;
    },
    [registerUser.fulfilled.type]: (
      state,
      action: PayloadAction<Required<RegisterVerifyData>>
    ) => {
      state.loading = false;
    },
    [registerUser.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = "Unable to register";
    },
    [getUser.pending.type]: (state) => {
      state.loading = true;
      state.error = undefined;
    },
    [getUser.fulfilled.type]: (
      state,
      action: PayloadAction<Required<AuthUserData>>
    ) => {
      state.loading = false;
      state.user = action.payload;
    },
    [getUser.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = "Unable to get user";
    },
    [logoutUser.pending.type]: (state) => {
      state.loading = true;
      state.error = undefined;
    },
    [logoutUser.fulfilled.type]: (state) => {
      state.loading = false;
      state.user = undefined;
    },
    [logoutUser.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = "Unable to logout";
    },
  },
});

export const {} = authSlice.actions;

export const authReducer = authSlice.reducer;
