import {
  EmailVerificationCodeForm,
  EmptyResponseSchema,
  GetAuthLoginResponseSchema,
  GetAuthRefreshResponseSchema,
  GetAuthResponseSchema,
  GetUserMeResponseSchema,
  GetUserSettingsResponseSchema,
  PostAuthLoginVerifyBody,
  PostAuthSignupBody,
  PostAuthSignupResponseSchema,
  PostAuthSignupVerifyBody,
} from "@mbsm/types";
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  timeoutErrorMessage: "Request timed out",
});
// // Define the structure of a retry queue item
// interface RetryQueueItem {
//   resolve: (value?: any) => void;
//   reject: (error?: any) => void;
//   config: AxiosRequestConfig;
// }

// // Create a list to hold the request queue
// const refreshAndRetryQueue: RetryQueueItem[] = [];

// let isRefreshing = false;

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest: AxiosRequestConfig = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       originalRequest.url !== "/api/auth/refresh"
//     ) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           // Refresh the access token
//           const refresh = await axios.get("/api/auth/refresh", {
//             withCredentials: true,
//             validateStatus: () => true,
//           });

//           if (refresh.status !== 200) throw new Error(refresh.statusText);

//           // Retry all requests in the queue with the new token
//           refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
//             api
//               .request(config)
//               .then((response) => resolve(response))
//               .catch((err) => reject(err));
//           });

//           // Clear the queue
//           refreshAndRetryQueue.length = 0;

//           // Retry the original request
//           return api(originalRequest);
//         } catch (refreshError) {
//           // Handle token refresh error
//           // You can clear all storage and redirect the user to the login page
//           throw refreshError;
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       // Add the original request to the queue
//       return new Promise<void>((resolve, reject) => {
//         refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
//       });
//     }

//     // Return a Promise rejection if the status code is not 401
//     return Promise.reject(error);
//   }
// );
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
    authLogin: async () => {
      const response = await api.get("/auth/login");
      return GetAuthLoginResponseSchema.parse(response.data);
    },
    authRefresh: async () => {
      const response = await api.get("/auth/refresh");
      return GetAuthRefreshResponseSchema.parse(response.data);
    },
    authLogout: async () => {
      const response = await api.get("/auth/logout");
      return EmptyResponseSchema.parse(response.data);
    },
    auth: async () => {
      const response = await api.get("/auth");
      return GetAuthResponseSchema.parse(response.data);
    },
  };
  post = {
    authSignup: async (body: PostAuthSignupBody) => {
      const response = await api.post("/auth/signup", body);
      return PostAuthSignupResponseSchema.parse(response.data);
    },
    authSignupVerify: async (body: PostAuthSignupVerifyBody) => {
      const response = await api.post("/auth/signup/verify", body);
      return EmptyResponseSchema.parse(response.data);
    },
    authLoginVerify: async (body: PostAuthLoginVerifyBody) => {
      const response = await api.post("/auth/login/verify", body);
      return EmptyResponseSchema.parse(response.data);
    },
    userEmailVerify: async (body: EmailVerificationCodeForm) => {
      const response = await api.post("/user/email/verify", body);
      return EmptyResponseSchema.parse(response.data);
    },
  };
}

export const apiClient = new ApiClient();
