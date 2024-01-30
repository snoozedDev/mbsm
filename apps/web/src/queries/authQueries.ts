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
  const { status } = useUserQuery();
  return status === "success";
};

export const useLoginMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
      const { options } = await login();
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
      await verifyLogin(attRes);
      return {
        success: true,
      };
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
      const { options } = await register({
        email,
        inviteCode,
      });

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

      await verifyRegister({
        attRes,
        email,
        inviteCode,
      });

      return {
        success: true,
      };
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
      const { options } = await getNewAuthenticatorOptions();

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
      const { authenticator } = await verifyNewAuthenticator({ attRes });

      return authenticator;
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
