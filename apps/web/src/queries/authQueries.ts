"use client";
import { toast } from "@/components/ui/use-toast";
import { codeFormSchema } from "@/lib/shemas/forms/codeFormSchema";
import { routes } from "@/server/routers";
import { Authenticator, InviteCode } from "@mbsm/types";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { z } from "zod";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  timeoutErrorMessage: "Request timed out",
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (!isRefreshing) {
              clearInterval(interval);
              resolve(api.request(err.config));
            }
          }, 100);
        });
      }
      isRefreshing = true;
      const refresh = await axios.get("/api/auth/refresh", {
        withCredentials: true,
        validateStatus: () => true,
      });
      isRefreshing = false;
      if (refresh.status === 200) {
        return api.request(err.config);
      } else {
        throw new Error("Unauthorized");
      }
    }
    throw err;
  }
);

export const useAuthenticatedQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> => {
  const { status } = useUserQuery();

  const enabled = useMemo(() => {
    return !!(options.enabled ?? true) && status === "success";
  }, [options.enabled, status]);

  return useQuery({
    ...options,
    enabled,
  });
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await routes.userInfo.clientReq({
        client: api,
      });
      return user.data;
    },
    retry: false,
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const logout = await api.get("/auth/logout");
      if (logout.status !== 200) {
        throw new Error(logout.data.length ? logout.data : logout.statusText);
      }
      return logout.data;
    },
    onSuccess: () => {
      toast({
        description: "You have been logged out.",
      });
      client.resetQueries({ queryKey: ["user"] });
      router.push("/");
    },
    retry: false,
  });
};

export const useIsLoggedIn = () => {
  const { status } = useUserQuery();
  return status === "success";
};

export const useLoginMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation(
    async () => {
      const login = await api.get("/auth/login");
      if (login.status !== 200) {
        throw new Error(login.data.length ? login.data : login.statusText);
      }
      let attRes;
      try {
        attRes = await startAuthentication(login.data.options);
      } catch (err) {
        if (err instanceof Error && "name" in err) {
          if (err.name === "NotAllowedError") {
            throw new Error("You denied the request for passkey.");
          }
        }
        throw err;
      }
      const verify = await api.post("/auth/login/verify", {
        attRes,
      });
      if (verify.status !== 200) {
        throw new Error(verify.data.length ? verify.data : verify.statusText);
      }
      return verify.data;
    },
    {
      onError: (err) => {
        toast({
          title: "Login failed",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      },
      onSuccess: () => {
        client.invalidateQueries({
          queryKey: ["user"],
        });
      },
    }
  );

  return requestLogin;
};

export const useRegisterMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation(
    async ({ email, inviteCode }: { email: string; inviteCode: string }) => {
      const register = await api.post(
        "/auth/register",
        {
          email,
          inviteCode,
        },
        {
          validateStatus: () => true,
        }
      );

      if (register.status !== 200) {
        throw new Error(
          register.data.length ? register.data : register.statusText
        );
      }
      let attRes;
      try {
        attRes = await startRegistration(register.data.options);
      } catch (err) {
        if (err instanceof Error && "name" in err) {
          if (err.name === "NotAllowedError") {
            throw new Error("You denied the request for passkey.");
          }
        }
        throw err;
      }
      const verify = await api.post("/auth/register/verify", {
        attRes,
        email,
        inviteCode,
      });
      if (verify.status !== 200) {
        throw new Error(verify.data.length ? verify.data : verify.statusText);
      }
      return verify.data;
    },
    {
      onSuccess: () => {
        client.invalidateQueries({
          queryKey: ["user"],
        });
      },
    }
  );

  return requestLogin;
};

export const useAddAuthenticatorMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation(
    async () => {
      const register = await api.get("/user/authenticator");

      if (register.status !== 200) {
        throw new Error(
          register.data.length ? register.data : register.statusText
        );
      }
      let attRes;
      try {
        attRes = await startRegistration(register.data.regOptions);
      } catch (err) {
        if (err instanceof Error && "name" in err) {
          if (err.name === "NotAllowedError") {
            throw new Error("You denied the request for passkey.");
          }
        }
        throw err;
      }
      const verify = await api.put("/user/authenticator", { attRes });
      if (verify.status !== 200) {
        throw new Error(verify.data.length ? verify.data : verify.statusText);
      }
      return verify.data.authenticator;
    },
    {
      onError: (err) => {
        toast({
          title: "Failed to add authenticator",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      },
      onSuccess: (newAuthenticator) => {
        client.setQueryData<{
          authenticators: Authenticator[];
          inviteCodes: InviteCode[];
        }>(["user", "settings"], (old) =>
          old
            ? {
                ...old,
                authenticators: [newAuthenticator, ...old.authenticators],
              }
            : old
        );
      },
    }
  );

  return requestLogin;
};

const clientReqApiWrapper = async <
  T extends () => Promise<AxiosResponse<any, any>>,
>(
  request: T
) => {
  try {
    const res = await request();
    return res.data;
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof AxiosError) {
      message = err.response?.data ?? err.response?.statusText ?? err.message;
    }
    throw new Error(message);
  }
};

export const useEmailVerificationMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user", "emailVerification"],
    mutationFn: (body: z.infer<typeof codeFormSchema>) =>
      clientReqApiWrapper(() =>
        routes.userEmailVerify.clientReq({
          client: api,
          body,
        })
      ),
    onSuccess: () => {
      client.resetQueries({
        queryKey: ["user"],
      });
      toast({
        description: "Your email has been verified.",
      });
    },
  });
};
