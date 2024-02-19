// import { renameAuthenticator } from "@/actions/authActions";
// import { getUserSettings } from "@/actions/userActions";
import { apiClient } from "@/utils/api";
import { Authenticator, InviteCode } from "@mbsm/types";
import { startRegistration } from "@simplewebauthn/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserMeQuery = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: apiClient.get.userMe,
    retry: false,
  });
};

export const useUserSettingsQuery = () => {
  return useQuery({
    queryKey: ["user", "settings"],
    queryFn: apiClient.get.userSettings,
    retry: false,
  });
};

export const useUpdateAuthenticatorMutation = ({
  credentialId,
}: {
  credentialId: string;
}) => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["authenticator", "update", credentialId],
    mutationFn: async ({ name }: { name: string }) => {
      const res = await apiClient.patch.userAuthenticatorCredentialId(
        credentialId,
        { name }
      );
      if (!res.success) throw new Error(res.error);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["user", "settings"],
      });
    },
    onError: () => {
      client.invalidateQueries({
        queryKey: ["user", "settings"],
      });
    },
  });
};

export const useEmailVerificationMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user", "emailVerification"],
    mutationFn: apiClient.post.userEmailVerify,
    onSuccess: () => {
      client.resetQueries({ queryKey: ["user"] });
      toast("Your email has been verified.");
    },
  });
};

export const useAddAuthenticatorMutation = () => {
  const client = useQueryClient();

  const requestLogin = useMutation({
    mutationFn: async () => {
      const optRes = await apiClient.get.userAuthenticator();
      if (!optRes.success) throw new Error(optRes.error);
      const { regOptions } = optRes;
      let attRes;
      try {
        attRes = await startRegistration(regOptions);
      } catch (err) {
        if (err instanceof Error && "name" in err) {
          if (err.name === "NotAllowedError") {
            throw new Error("You denied the request for passkey.");
          }
        }
        throw err;
      }
      const verifyRes = await apiClient.put.userAuthenticator({ attRes });
      if (!verifyRes.success) throw new Error(verifyRes.error);
      return verifyRes.authenticator;
    },
    onError: (err) => {
      toast("Failed to add authenticator", {
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
