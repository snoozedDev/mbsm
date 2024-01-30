import { renameAuthenticator } from "@/app/actions/authActions";
import { getUserSettings } from "@/app/actions/userActions";
import { Authenticator } from "@mbsm/types";
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
      client.setQueryData(
        ["user", "settings"],
        (oldData: any, { name }: any) =>
          oldData
            ? {
                ...oldData,
                authenticators: oldData.authenticators?.map(
                  (a: Authenticator) => {
                    if (a.credentialId === credentialId) return { ...a, name };
                    return a;
                  }
                ),
              }
            : oldData
      );
    },
    onError: (err) => {
      console.log(err);
      client.invalidateQueries({
        queryKey: ["user", "settings"],
      });
    },
  });
};
