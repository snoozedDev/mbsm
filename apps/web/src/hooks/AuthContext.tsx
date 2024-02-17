import { apiClient } from "@/utils/api";
import { PostAuthSignupBody } from "@mbsm/types";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextData = {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  register: (body: PostAuthSignupBody) => Promise<void>;
  logout: () => Promise<void>;

  getToken: (ignoreCache?: boolean) => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextData>({
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  getToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async () => {
    setIsLoading(true);
    const optRes = await apiClient.get.authLogin();
    if (!optRes.success) throw optRes.error;
    let attRes;
    try {
      attRes = await startAuthentication(optRes.options);
    } catch (err) {
      if (err instanceof Error && "name" in err) {
        if (err.name === "NotAllowedError") {
          throw new Error("You denied the request for passkey.");
        }
      }
      throw err;
    }
    const verRes = await apiClient.post.authLoginVerify({ attRes });
    if (!verRes.success) throw new Error(verRes.error);
    setIsLoading(false);
    setIsAuthenticated(true);
  };

  const register = async ({ email, inviteCode }: PostAuthSignupBody) => {
    setIsLoading(true);
    const optRes = await apiClient.post.authSignup({
      email,
      inviteCode,
    });
    if (!optRes.success) throw new Error(optRes.error);
    const { options } = optRes;
    let attRes;
    try {
      attRes = await startRegistration(options);
    } catch (err) {
      if (err instanceof Error && "name" in err) {
        if (err.name === "NotAllowedError") {
          throw new Error("You denied the request for passkey.");
        }
      }
      throw err;
    }
    const verRes = await apiClient.post.authSignupVerify({
      attRes,
      email,
      inviteCode,
    });
    if (!verRes.success) throw new Error(verRes.error);
    setIsLoading(false);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsLoading(true);
    const res = await apiClient.get.authLogout();
    if (!res.success) throw new Error(res.error);
    setIsLoading(false);
    setIsAuthenticated(false);
  };

  const getToken = async (ignoreCache?: boolean) => {
    console.log("Getting token");
    const procedure = ignoreCache
      ? apiClient.get.authRefresh
      : apiClient.get.auth;
    try {
      const res = await procedure();
      if (!res.success) throw new Error(res.error);
      setIsLoading(false);
      setIsAuthenticated(true);
      return res.accessToken;
    } catch (e) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return null;
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoading, isAuthenticated, login, register, getToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { isLoading, isAuthenticated, getToken } = useContext(AuthContext);
  const fetchAccessToken = async ({
    forceRefreshToken,
  }: {
    forceRefreshToken: boolean;
  }) => {
    // Here you can do whatever transformation to get the ID Token
    // or null
    // Make sure to fetch a new token when `forceRefreshToken` is true
    return await getToken(forceRefreshToken);
  };
  return {
    // Whether the auth provider is in a loading state
    isLoading,
    // Whether the auth provider has the user signed in
    isAuthenticated,
    // The async function to fetch the ID token
    fetchAccessToken,
  };
};
