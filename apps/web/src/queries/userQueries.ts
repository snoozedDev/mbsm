// import { renameAuthenticator } from "@/actions/authActions";
// import { getUserSettings } from "@/actions/userActions";
import { trpc } from "@/components/query-layout";
import { UploadClientPayload } from "@/utils/uploadUtils";
import { getErrorMessage } from "@mbsm/utils";
import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
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

export const useUploadFileMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const presign = trpc.user.presign.useMutation();
  const verifyUpload = trpc.user.verifyUpload.useMutation();

  const uploadFile = async ({
    file,
    options,
  }: {
    file: File;
    options: UploadClientPayload;
  }) => {
    setIsLoading(true);
    try {
      const { url, fileId } = await presign.mutateAsync(options);

      const res = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (res.status !== 200) {
        throw new Error("Failed to upload file");
      }

      await verifyUpload.mutateAsync({ fileId });

      return res.data;
    } catch (err) {
      toast.error("Failed to upload file", {
        description: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading };
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
