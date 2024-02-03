"use server";

import { logAndReturnGenericError } from "@/server/serverUtils";
import {
  Token,
  decodeAccessToken,
  refreshAndSetTokens,
} from "@/utils/tokenUtils";
import { InferSelectModel, getUserByNanoId, schema } from "@mbsm/db-layer";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { ActionResponse } from "./authActions";

export const getAuthContext = async (
  cookies: ReadonlyRequestCookies
): Promise<
  ActionResponse<{
    token: Token;
    user: InferSelectModel<typeof schema.user>;
  }>
> => {
  try {
    const accessToken = cookies.get("accessToken");
    const tokenContents = accessToken
      ? decodeAccessToken(accessToken.value)
      : (await refreshAndSetTokens()).token;

    if (!tokenContents) throw "No token found.";

    const user = await getUserByNanoId(tokenContents.user.userNanoId);
    if (!user) throw "No user found for token. This should never happen.";

    return {
      success: true,
      token: tokenContents,
      user: user,
    };
  } catch (e) {
    return logAndReturnGenericError(e, "unauthorized");
  }
};
