// import { renameAuthenticator } from "@/actions/authActions";
// import { getUserSettings } from "@/actions/userActions";
import { trpc } from "@/components/query-layout";
import { getErrorMessage } from "@mbsm/utils";
import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import { toast } from "sonner";

export const useUserMeQuery = () => {
  return trpc.user.me.useQuery(undefined, { retry: false });
};

export const useUserSettingsQuery = () => {
  return trpc.user.settings.useQuery(undefined, { retry: false });
};

export const useUpdateAuthenticatorMutation = () => {
  const utils = trpc.useUtils();

  return trpc.user.updateAuthenticator.useMutation({
    onSuccess: () => {
      utils.user.settings.refetch();
    },
    onError: () => {
      utils.user.settings.reset();
    },
  });
};

export const useEmailVerificationMutation = () => {
  const utils = trpc.useUtils();

  return trpc.user.verifyEmail.useMutation({
    onSuccess: () => {
      utils.user.me.refetch();
      toast("Your email has been verified.");
    },
  });
};

export const useAddAuthenticatorMutation = () => {
  const utils = trpc.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const startAddAuthenticator = trpc.user.startAddAuthenticator.useMutation();
  const verifyAddAuthenticator = trpc.user.verifyAddAuthenticator.useMutation();

  const requestAddAuthenticator = async () => {
    setIsLoading(true);
    try {
      const { options } = await startAddAuthenticator.mutateAsync();
      const attRes = await startRegistration(options);
      const { authenticator } = await verifyAddAuthenticator.mutateAsync({
        attRes,
      });
      utils.user.settings.setData(undefined, (old) =>
        old
          ? {
              ...old,
              authenticators: [authenticator, ...old.authenticators],
            }
          : undefined
      );
    } catch (err) {
      toast.error("Failed to add authenticator", {
        description: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { requestAddAuthenticator, isLoading };
};

export const useCreateAccountMutation = () => {
  const utils = trpc.useUtils();
  return trpc.user.createAccount.useMutation({
    onSuccess: () => {
      utils.user.me.refetch();
    },
  });
};
