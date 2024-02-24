"use client";

import { trpc } from "@/components/query-layout";
import { SignUpFormValues } from "@/components/signup-form";
import { getErrorMessage } from "@mbsm/utils";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUserMeQuery } from "./userQueries";

export const useSignOutMutation = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.auth.signOut.useMutation({
    onSuccess: () => {
      toast("You have been logged out.");
      utils.user.me.invalidate();
      router.push("/");
    },
    retry: false,
  });
};

export const useSignedInStatus = () => {
  const { isPending, isSuccess } = useUserMeQuery();
  return { isPending, isSignedIn: isSuccess };
};

export const useSignInMutation = () => {
  const utils = trpc.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const startSignIn = trpc.auth.startSignin.useMutation();
  const verifySignIn = trpc.auth.verifySignin.useMutation();

  const requestSignIn = async () => {
    setIsLoading(true);
    try {
      const { options } = await startSignIn.mutateAsync();
      const attRes = await startAuthentication(options);
      await verifySignIn.mutateAsync({ attRes });
      utils.user.me.invalidate();
    } catch (err) {
      toast("Login failed", { description: getErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, requestSignIn };
};

export const useSignUpMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const startSignup = trpc.auth.startSignup.useMutation();
  const verifySignup = trpc.auth.verifySignup.useMutation();
  const utils = trpc.useUtils();

  const requestSignUp = async (values: SignUpFormValues) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const { options } = await startSignup.mutateAsync(values);
      const attRes = await startRegistration(options);
      await verifySignup.mutateAsync({ ...values, attRes });
      utils.user.me.invalidate();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { requestSignUp, isLoading, error };
};
