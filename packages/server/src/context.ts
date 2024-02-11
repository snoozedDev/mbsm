import { getUserByNanoId } from "@mbsm/db-layer";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getCookiesFromReq } from "./utils/requestUtils";
import { decodeAccessToken, refreshAndSetTokens } from "./utils/tokenUtils";

export const createContext = async ({
  req,
  resHeaders,
  info,
}: FetchCreateContextFnOptions) => {
  try {
    const { accessToken } = getCookiesFromReq(req);
    const tokenContents = accessToken
      ? decodeAccessToken(accessToken)
      : (await refreshAndSetTokens(req, resHeaders)).token;

    if (!tokenContents) throw "No token found.";

    const user = await getUserByNanoId(tokenContents.user.userNanoId);
    if (!user) throw "No user found for token. This should never happen.";

    return {
      token: tokenContents,
      user: user,
    };
  } catch (e) {
    console.log("createContext", e);
    return {
      token: null,
      user: null,
    };
  }
};
