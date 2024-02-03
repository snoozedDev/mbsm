"use server";

import { logAndReturnGenericError } from "@/server/serverUtils";
import {
  Token,
  decodeAccessToken,
  refreshAndSetTokens,
} from "@/utils/tokenUtils";
import { InferSelectModel, getUserByNanoId, schema } from "@mbsm/db-layer";
import { cookies } from "next/headers";
import { ActionResponse } from "./authActions";

export const getAuthContext = async (): Promise<
  ActionResponse<{
    token: Token;
    user: InferSelectModel<typeof schema.user>;
  }>
> => {
  try {
    const accessToken = cookies().get("accessToken");
    const tokenContents = accessToken
      ? decodeAccessToken(accessToken.value)
      : (await refreshAndSetTokens()).token;

    if (!tokenContents) throw "No token found.";

    const user = await getUserByNanoId(tokenContents.user.userNanoId);
    if (!user) throw "No user found for token. This should never happen.";

    console.log({ user, tokenContents });
    return {
      success: true,
      token: tokenContents,
      user: user,
    };
  } catch (e) {
    return logAndReturnGenericError(e, "unauthorized");
  }
};
