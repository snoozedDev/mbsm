"use client";

import { apiClient } from "@/utils/api";
import { PostAuthSignupBody } from "@mbsm/types";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserMeQuery } from "./userQueries";

export const useLogoutMutation = () => {
  const router = useRouter();
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: apiClient.get.authLogout, //logout,
    onSuccess: ({ success }) => {
      if (success) {
        toast("You have been logged out.");
        client.resetQueries({ queryKey: ["user"] });
        router.push("/");
      }
    },
    retry: false,
  });
};

export const useIsLoggedIn = () => {
  const { isPending, data } = useUserMeQuery();
  return { isPending, isLoggedIn: !isPending && Boolean(data?.success) };
};

export const useLoginMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
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
      return verRes;
    },
    onError: (err) => {
      toast("Login failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return requestLogin;
};

export const useRegisterMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, inviteCode }: PostAuthSignupBody) => {
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
      return verRes;
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export const useAddAuthenticatorMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
      // const optRes = await getNewAuthenticatorOptions();
      // if (!optRes.success) throw new Error(optRes.error);
      // const { options } = optRes;
      // let attRes;
      // try {
      //   attRes = await startRegistration(options);
      // } catch (err) {
      //   if (err instanceof Error && "name" in err) {
      //     if (err.name === "NotAllowedError") {
      //       throw new Error("You denied the request for passkey.");
      //     }
      //   }
      //   throw err;
      // }
      // const verifyRes = await verifyNewAuthenticator({ attRes });
      // if (!verifyRes.success) throw new Error(verifyRes.error);
      // return verifyRes.authenticator;
    },
    onError: (err) => {
      toast("Failed to add authenticator", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
    onSuccess: (newAuthenticator) => {
      // client.setQueryData<{
      //   authenticators: Authenticator[];
      //   inviteCodes: InviteCode[];
      // }>(["user", "settings"], (old) =>
      // old
      //   ? {
      //       ...old,
      //       authenticators: [newAuthenticator, ...old.authenticators],
      //     }
      //   : old
      // );
    },
  });

  return requestLogin;
};
