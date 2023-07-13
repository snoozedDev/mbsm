// import { LoginVerifyData } from "@/pages/api/auth/login/verify";
// import { RegisterVerifyData } from "@/pages/api/auth/register/verify";
// import { AuthUserData } from "@/pages/api/auth/user";
import { createSlice } from "@reduxjs/toolkit";

export type AuthState = {
  loading: boolean;
  error?: string;
  user?: {
    username: string;
  };
};

const initialState: AuthState = {
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState as AuthState,
  reducers: {},
  extraReducers: (builder) => builder,
});

export const {} = authSlice.actions;

export const authReducer = authSlice.reducer;
