"use client";
import {
  getNewAuthenticatorOptions,
  getUserInfo,
  login,
  logout,
  register,
  verifyEmail,
  verifyLogin,
  verifyNewAuthenticator,
  verifyRegister,
} from "@/app/actions/authActions";
import { toast } from "@/components/ui/use-toast";
import { codeFormSchema } from "@/lib/shemas/forms/codeFormSchema";
import { Authenticator, InviteCode } from "@mbsm/types";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(),
    retry: false,
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
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
  const { status, data } = useUserQuery();
  return status === "success" && data.success === true;
};

export const useLoginMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
      const optRes = await login();
      if (!optRes.success) throw new Error(optRes.error);
      const { options } = optRes;
      let attRes;
      try {
        attRes = await startAuthentication(options);
      } catch (err) {
        if (err instanceof Error && "name" in err) {
          if (err.name === "NotAllowedError") {
            throw new Error("You denied the request for passkey.");
          }
        }
        throw err;
      }
      const verRes = await verifyLogin(attRes);
      if (!verRes.success) throw new Error(verRes.error);
      return verRes;
    },
    onError: (err) => {
      toast({
        title: "Login failed",
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

  const requestLogin = useMutation({
    mutationFn: async ({
      email,
      inviteCode,
    }: {
      email: string;
      inviteCode: string;
    }) => {
      const optRes = await register({
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

      const verRes = await verifyRegister({
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

  return requestLogin;
};

export const useAddAuthenticatorMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
      const optRes = await getNewAuthenticatorOptions();
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
      const verifyRes = await verifyNewAuthenticator({ attRes });
      if (!verifyRes.success) throw new Error(verifyRes.error);

      return verifyRes.authenticator;
    },
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
  });

  return requestLogin;
};

export const useEmailVerificationMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user", "emailVerification"],
    mutationFn: (body: z.infer<typeof codeFormSchema>) => verifyEmail(body),
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
