import { renameAuthenticator } from "@/app/actions/authActions";
import { getUserSettings } from "@/app/actions/userActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserSettingsQuery = () => {
  return useQuery({
    queryKey: ["user", "settings"],
    queryFn: () => getUserSettings(),
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
      await renameAuthenticator({
        credentialId,
        newName: name,
      });
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
