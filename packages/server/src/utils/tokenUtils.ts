import {
  InferSelectModel,
  getUserByNanoId,
  redis,
  schema,
} from "@mbsm/db-layer";
import { Token, isToken } from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { CookieOptions, getCookiesFromReq, setCookie } from "./requestUtils";

export function generateAccessToken(token: Token) {
  return jwt.sign(token, getEnvAsStr("SECRET_ATOKEN"), {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(token: Token) {
  return jwt.sign(token, getEnvAsStr("SECRET_RTOKEN"), {
    expiresIn: "30d",
  });
}

export async function addToList({
  refresher,
  uniqueId,
  userNanoId,
}: {
  userNanoId: string;
  uniqueId: string;
  refresher: string;
}) {
  try {
    await redis.hset("refresh:" + userNanoId, {
      [uniqueId]: refresher,
    });
  } catch (error) {
    console.log(error);
  }
}

const decodeRefreshToken = (token: string): Token | undefined => {
  try {
    const decoded = jwt.verify(token, getEnvAsStr("SECRET_RTOKEN"));
    if (isToken(decoded)) return decoded;
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const getAccessTokenCookieOpts = (token: string): CookieOptions => ({
  name: "accessToken",
  value: token,
  maxAge: 60 * 15,
  path: "/",
  httpOnly: true,
  secure: getEnvAsBool("IS_PROD"),
});

export const getRefreshTokenCookieOpts = (token: string): CookieOptions => ({
  name: "refreshToken",
  value: token,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
  httpOnly: true,
  secure: getEnvAsBool("IS_PROD"),
});

export const getUniqueIdentifierCookieOpts = (
  uniqueId: string
): CookieOptions => ({
  name: "uniqueIdentifier",
  value: uniqueId,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
  httpOnly: true,
  secure: getEnvAsBool("IS_PROD"),
});

export const decodeAccessToken = (token: string): Token | undefined => {
  try {
    const decoded = jwt.verify(token, getEnvAsStr("SECRET_ATOKEN"));
    if (isToken(decoded)) return decoded;
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const refreshAndSetTokens = async (
  req: Request,
  resHeaders: Headers
) => {
  const cookies = getCookiesFromReq(req);
  const authError = new Error("Unauthorized");
  const { refreshToken, uniqueIdentifier } = cookies;
  const userAgent = req.headers.get("user-agent");
  if (!refreshToken || !uniqueIdentifier || !userAgent) throw authError;
  const tokenContents = decodeRefreshToken(refreshToken);
  if (!tokenContents) throw authError;
  try {
    const userTokens = await redis.hgetall<Record<string, string>>(
      "refresh:" + tokenContents.user.userNanoId
    );

    if (!userTokens) throw authError;
    const redisRToken = userTokens[uniqueIdentifier];
    if (redisRToken !== refreshToken) throw authError;

    await deleteExpiredUserTokens({
      userNanoId: tokenContents.user.userNanoId,
      tokens: userTokens,
    });

    const user = await getUserByNanoId(tokenContents.user.userNanoId);

    if (!user) throw authError;

    const token = {
      level: "user",
      user: {
        username: user.email,
        userNanoId: user.nanoId,
      },
      userAgent,
    } satisfies Token;

    const accessToken = generateAccessToken(token);

    const newRefreshToken = generateRefreshToken(token);

    await addToList({
      refresher: newRefreshToken,
      uniqueId: uniqueIdentifier,
      userNanoId: user.nanoId,
    });

    setCookie(resHeaders, getAccessTokenCookieOpts(accessToken));

    setCookie(resHeaders, getRefreshTokenCookieOpts(newRefreshToken));

    return { token };
  } catch (error) {
    console.log("refreshAndSetTokens", error);
    throw error;
  }
};

export const createAndSetAuthTokens = async (
  req: Request,
  resHeaders: Headers,
  user: InferSelectModel<typeof schema.user>
) => {
  const userAgent = req.headers.get("user-agent");
  if (!userAgent) throw new Error("No User Agent");
  const currentUniqueId = getCookiesFromReq(req).uniqueIdentifier;

  const token = {
    level: "user",
    user: {
      username: user.email,
      userNanoId: user.nanoId,
    },
    userAgent,
  } satisfies Token;

  const accessToken = generateAccessToken(token);

  const refreshToken = generateRefreshToken(token);

  const uniqueId = currentUniqueId ?? nanoid(16);

  await addToList({
    refresher: refreshToken,
    userNanoId: user.nanoId,
    uniqueId,
  });

  setCookie(resHeaders, getAccessTokenCookieOpts(accessToken));
  setCookie(resHeaders, getRefreshTokenCookieOpts(refreshToken));
  setCookie(resHeaders, getUniqueIdentifierCookieOpts(uniqueId));
};

export const deleteExpiredUserTokens = async ({
  userNanoId,
  tokens,
}: {
  userNanoId: string;
  tokens: Record<string, string>;
}) => {
  const expiredTokens = Object.entries(tokens).filter(
    ([_, token]) => !decodeRefreshToken(token)
  );
  if (expiredTokens.length === 0) return;
  await redis.hdel("refresh:" + userNanoId, ...expiredTokens.map(([id]) => id));
};
