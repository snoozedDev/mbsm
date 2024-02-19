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

export const useSignOutMutation = () => {
  const router = useRouter();
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: apiClient.get.authSignOut, //logout,
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

export const useSignedInStatus = () => {
  const { isPending, data } = useUserMeQuery();
  return { isPending, isSignedIn: !isPending && Boolean(data?.success) };
};

export const useSignInMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
      const optRes = await apiClient.get.authSignIn();
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
      const verRes = await apiClient.post.authSignInVerify({ attRes });
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

export const useSignUpMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, inviteCode }: PostAuthSignupBody) => {
      const optRes = await apiClient.post.authSignUp({
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
