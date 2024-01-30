"use server";

import { logAndReturnGenericError } from "@/server/serverUtils";
import {
  Token,
  decodeAccessToken,
  refreshAndSetTokens,
} from "@/utils/tokenUtils";
import { InferSelectModel, getUserByNanoId, schema } from "@mbsm/db-layer";
import { cookies } from "next/headers";

export const actionWithAuthContext =
  <
    P = undefined,
    R = void,
    A extends boolean = true,
    U = A extends true ? InferSelectModel<typeof schema.user> : undefined,
    T = A extends true ? Token : undefined,
  >({
    action,
    authRequired,
  }: {
    action: (params: { token: T; user: U; params: P }) => Promise<R>;
    authRequired: A;
  }) =>
  async (params?: P) => {
    const accessToken = cookies().get("accessToken");
    let tokenContents;

    if (authRequired && !accessToken) {
      const { token } = await refreshAndSetTokens();
      tokenContents = token;
    }

    if (accessToken && !tokenContents)
      tokenContents = decodeAccessToken(accessToken?.value || "");

    if (authRequired && !tokenContents) {
      const { token } = await refreshAndSetTokens();
      tokenContents = token;
    }

    let user;

    if (tokenContents)
      user = await getUserByNanoId(tokenContents.user.userNanoId);

    if (authRequired && !user)
      throw logAndReturnGenericError("No user found", "unauthorized");

    if (authRequired) {
      tokenContents;
    }

    return await action({
      token: tokenContents as T,
      user: user as U,
      params: params as P,
    });
  };
