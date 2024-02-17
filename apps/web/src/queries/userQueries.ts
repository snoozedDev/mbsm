// import { renameAuthenticator } from "@/actions/authActions";
// import { getUserSettings } from "@/actions/userActions";
import { apiClient } from "@/utils/api";
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
      // await renameAuthenticator({
      //   credentialId,
      //   newName: name,
      // });
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
