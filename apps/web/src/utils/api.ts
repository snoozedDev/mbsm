import {
  Authenticator,
  EmailVerificationCodeForm,
  EmptyResponseSchema,
  GetAuthSignInResponseSchema,
  GetUserAuthenticatorResponseSchema,
  GetUserMeResponseSchema,
  GetUserSettingsResponseSchema,
  PatchUserAuthenticatorCredentialIdBody,
  PostAuthSignInVerifyBody,
  PostAuthSignupBody,
  PostAuthSignupResponseSchema,
  PostAuthSignupVerifyBody,
  PutUserAuthenticatorResponseSchema,
} from "@mbsm/types";
import axios, { AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  timeoutErrorMessage: "Request timed out",
});
// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest.url !== "/api/auth/refresh"
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh the access token
          const refresh = await axios.get("/api/auth/refresh", {
            withCredentials: true,
            validateStatus: () => true,
          });

          if (refresh.status !== 200) throw new Error(refresh.statusText);

          // Retry all requests in the queue with the new token
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            api
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          });

          // Clear the queue
          refreshAndRetryQueue.length = 0;

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Handle token refresh error
          // You can clear all storage and redirect the user to the login page
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      // Add the original request to the queue
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    // Return a Promise rejection if the status code is not 401
    return Promise.reject(error);
  }
);

class ApiClient {
  get = {
    userMe: async () => {
      const response = await api.get("/user/me");
      return GetUserMeResponseSchema.parse(response.data);
    },
    userSettings: async () => {
      const response = await api.get("/user/settings");
      return GetUserSettingsResponseSchema.parse(response.data);
    },
    userAuthenticator: async () => {
      const response = await api.get("/user/authenticator");
      return GetUserAuthenticatorResponseSchema.parse(response.data);
    },
    authSignIn: async () => {
      const response = await api.get("/auth/signin");
      return GetAuthSignInResponseSchema.parse(response.data);
    },
    authRefresh: async () => {
      const response = await api.get("/auth/refresh");
      return EmptyResponseSchema.parse(response.data);
    },
    authSignOut: async () => {
      const response = await api.get("/auth/signout");
      return EmptyResponseSchema.parse(response.data);
    },
  };
  post = {
    authSignUp: async (body: PostAuthSignupBody) => {
      const response = await api.post("/auth/signup", body);
      return PostAuthSignupResponseSchema.parse(response.data);
    },
    authSignupVerify: async (body: PostAuthSignupVerifyBody) => {
      const response = await api.post("/auth/signup/verify", body);
      return EmptyResponseSchema.parse(response.data);
    },
    authSignInVerify: async (body: PostAuthSignInVerifyBody) => {
      const response = await api.post("/auth/signin/verify", body);
      return EmptyResponseSchema.parse(response.data);
    },
    userEmailVerify: async (body: EmailVerificationCodeForm) => {
      const response = await api.post("/user/email/verify", body);
      return EmptyResponseSchema.parse(response.data);
    },
  };
  put = {
    userAuthenticator: async (body: any) => {
      const response = await api.put("/user/authenticator", body);
      return PutUserAuthenticatorResponseSchema.parse(response.data);
    },
  };
  patch = {
    userAuthenticatorCredentialId: async (
      credentialId: Authenticator["credentialId"],
      body: PatchUserAuthenticatorCredentialIdBody
    ) => {
      const response = await api.patch(
        "/user/authenticator/" + credentialId,
        body
      );
      return EmptyResponseSchema.parse(response.data);
    },
  };
}

export const apiClient = new ApiClient();
