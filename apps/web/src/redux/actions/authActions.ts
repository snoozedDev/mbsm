import { toast } from "@/components/ui/use-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  validateStatus: () => true,
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (username: string, { dispatch }) => {
    const {
      data: { regOptions },
    } = await api.post("/auth/register", {
      username,
    });
    const attRes = await startRegistration(regOptions);
    const { data } = await api.post("/auth/register/verify", {
      attRes,
      username,
    });
    if (data.verified) {
      dispatch(getUser());
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (_, { dispatch }) => {
    try {
      const {
        data: { options },
      } = await api.get("/auth/login");
      console.log({ options });
      const attRes = await startAuthentication(options);
      const { data, status } = await api.post("/auth/login/verify", {
        attRes,
      });
      console.log({ data, status });
      if (status === 200 && data.verified) {
        dispatch(getUser());
      } else {
        toast({
          title: "Login failed",
        });
        console.error("Login failed");
      }
    } catch (e) {
      console.error(e);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { dispatch, getState }) => {
    const { data } = await api.get("/auth/user");

    return data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    await api.get("/auth/logout");
  }
);

export const addNewAuth = createAsyncThunk(
  "auth/addNewAuth",
  async (_, { dispatch }) => {
    const {
      data: { regOptions },
    } = await api.post("/auth/user/request_new_auth");
    const attRes = await startRegistration(regOptions);
    const {
      data: { verified },
    } = await api.post("/auth/user/verify_new_auth", { attRes });
    if (verified) dispatch(getUser());
    else {
      console.error("Adding new authenticator failed");
    }
  }
);
