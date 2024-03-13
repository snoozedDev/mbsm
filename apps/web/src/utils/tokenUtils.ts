import { getCookie, setCookie } from "@/server/cookieUtils";
import { logAndReturnGenericError } from "@/server/serverUtils";
import { InferSelectModel, getUserById, redis, schema } from "@mbsm/db-layer";
import { Token, isToken } from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { CookieSerializeOptions } from "cookie";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const shapeToken = (user: InferSelectModel<typeof schema.user>): Token => ({
  user: { id: user.id, emailVerified: user.emailVerified },
});

const generateAccessToken = (token: Token) =>
  jwt.sign(token, getEnvAsStr("SECRET_ATOKEN"), {
    expiresIn: "15s",
  });

const generateRefreshToken = (token: Token) =>
  jwt.sign(token, getEnvAsStr("SECRET_RTOKEN"), {
    expiresIn: "30d",
  });

const accessTokenCookieOptions: Partial<CookieSerializeOptions> = {
  httpOnly: true,
  path: "/api",
  maxAge: 15, // 15 minutes
  expires: new Date(Date.now() + 1000 * 15), // 15 minutes
  secure: getEnvAsBool("IS_PROD"),
};

const refreshTokenCookieOptions: Partial<CookieSerializeOptions> = {
  httpOnly: true,
  path: "/api/auth/refresh",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  secure: getEnvAsBool("IS_PROD"),
};

const uniqueIdentifierCookieOptions: Partial<CookieSerializeOptions> = {
  httpOnly: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 30 * 12 * 10, // 10 years
  expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 12 * 10 * 1000), // 10 years
  secure: getEnvAsBool("IS_PROD"),
};

export async function addToList({
  refresher,
  uniqueId,
  id,
}: {
  id: string;
  uniqueId: string;
  refresher: string;
}) {
  try {
    await redis.hset("refresh:" + id, {
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

export const setAccessTokenCookie = (resHeaders: Headers, token: string) =>
  setCookie(resHeaders, "accessToken", token, accessTokenCookieOptions);

export const setRefreshTokenCookie = (resHeaders: Headers, token: string) =>
  setCookie(resHeaders, "refreshToken", token, refreshTokenCookieOptions);

export const removeAccessTokenCookie = (resHeaders: Headers) =>
  setCookie(resHeaders, "accessToken", "", {
    ...accessTokenCookieOptions,
    maxAge: 0,
    expires: new Date(Date.now()),
  });

export const removeRefreshTokenCookie = (resHeaders: Headers) =>
  setCookie(resHeaders, "refreshToken", "", {
    ...refreshTokenCookieOptions,
    maxAge: 0,
    expires: new Date(Date.now()),
  });

export const setUniqueIdentifierCookie = (
  resHeaders: Headers,
  uniqueId: string
) =>
  setCookie(
    resHeaders,
    "uniqueIdentifier",
    uniqueId,
    uniqueIdentifierCookieOptions
  );

export const removeUniqueIdentifierCookie = (resHeaders: Headers) =>
  setCookie(resHeaders, "uniqueIdentifier", "", {
    ...uniqueIdentifierCookieOptions,
    maxAge: 0,
    expires: new Date(Date.now()),
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

export const refreshAndSetTokens = async (req: Request) => {
  const refreshToken = getCookie(req, "refreshToken");
  const uniqueId = getCookie(req, "uniqueIdentifier");
  const userAgent = req.headers.get("user-agent");
  if (!refreshToken || !uniqueId || !userAgent) {
    return logAndReturnGenericError(
      "No refresh token or unique identifier",
      "unauthorized"
    );
  }
  const tokenContents = decodeRefreshToken(refreshToken);
  if (!tokenContents)
    return logAndReturnGenericError("Invalid token", "unauthorized");
  const { id } = tokenContents.user;
  const userTokens = await redis.hgetall<Record<string, string>>(
    "refresh:" + id
  );

  if (!userTokens)
    return logAndReturnGenericError("No user tokens", "unauthorized");

  const redisRToken = userTokens[uniqueId];

  if (redisRToken !== refreshToken)
    return logAndReturnGenericError("Invalid token", "unauthorized");

  await deleteExpiredUserTokens({
    id,
    tokens: userTokens,
  });

  const user = await getUserById(id);

  if (!user) {
    return logAndReturnGenericError("No user found", "unauthorized");
  }

  const token = shapeToken(user);

  const accessToken = generateAccessToken(token);

  const newRefreshToken = generateRefreshToken(token);

  await addToList({
    refresher: newRefreshToken,
    uniqueId,
    id: user.id,
  });

  const headers = new Headers();

  setAccessTokenCookie(headers, accessToken);
  setRefreshTokenCookie(headers, newRefreshToken);

  const res = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  });

  return res;
};

export const createAndSetAuthTokens = async (
  req: Request,
  resHeaders: Headers,
  user: InferSelectModel<typeof schema.user>
) => {
  const userAgent = req.headers.get("user-agent");
  if (!userAgent) throw new Error("No User Agent");
  const currentUniqueId = getCookie(req, "uniqueIdentifier");

  const token = shapeToken(user);

  const accessToken = generateAccessToken(token);

  const refreshToken = generateRefreshToken(token);

  const uniqueId = currentUniqueId ?? nanoid(16);

  await addToList({
    refresher: refreshToken,
    id: user.id,
    uniqueId,
  });

  setAccessTokenCookie(resHeaders, accessToken);
  setRefreshTokenCookie(resHeaders, refreshToken);
  setUniqueIdentifierCookie(resHeaders, uniqueId);
};

export const deleteExpiredUserTokens = async ({
  id,
  tokens,
}: {
  id: string;
  tokens: Record<string, string>;
}) => {
  const expiredTokens = Object.entries(tokens).filter(
    ([_, token]) => !decodeRefreshToken(token)
  );
  if (expiredTokens.length === 0) return;
  await redis.hdel("refresh:" + id, ...expiredTokens.map(([id]) => id));
};
