import { routes } from "@/server/routers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, useAuthenticatedQuery } from "./authQueries";
import { Authenticator } from "@mbsm/types";

export const useUserSettingsQuery = () => {
  return useAuthenticatedQuery({
    queryKey: ["user", "settings"],
    queryFn: async () => {
      const res = await routes.userSettings.clientReq({
        client: api,
      });
      return res.data;
    },
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
      const { data } = await api.patch(`/user/authenticator/${credentialId}`, {
        name,
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
      client.invalidateQueries(["user", "settings"]);
    },
  });
};
