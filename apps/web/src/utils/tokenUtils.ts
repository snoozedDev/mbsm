import { logAndReturnGenericError } from "@/server/serverUtils";
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
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

const shapeToken = (user: InferSelectModel<typeof schema.user>): Token => ({
  user: { nanoId: user.nanoId },
});

const generateAccessToken = (token: Token) =>
  jwt.sign(token, getEnvAsStr("SECRET_ATOKEN"), {
    expiresIn: "15m",
  });

const generateRefreshToken = (token: Token) =>
  jwt.sign(token, getEnvAsStr("SECRET_RTOKEN"), {
    expiresIn: "30d",
  });

const accessTokenCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  path: "/api",
  maxAge: 60 * 15, // 15 minutes
  expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
  secure: getEnvAsBool("IS_PROD"),
};

const refreshTokenCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  path: "/api/auth/refresh",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  secure: getEnvAsBool("IS_PROD"),
};

export async function addToList({
  refresher,
  uniqueId,
  nanoId,
}: {
  nanoId: string;
  uniqueId: string;
  refresher: string;
}) {
  try {
    await redis.hset("refresh:" + nanoId, {
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

export const setAccessTokenCookie = (res: NextResponse, token: string) =>
  res.cookies.set("accessToken", token, accessTokenCookieOptions);

export const setRefreshTokenCookie = (res: NextResponse, token: string) =>
  res.cookies.set("refreshToken", token, refreshTokenCookieOptions);

export const removeAccessTokenCookie = (res: NextResponse) =>
  res.cookies.set("accessToken", "", {
    ...accessTokenCookieOptions,
    maxAge: 0,
    expires: new Date(Date.now()),
  });

export const removeRefreshTokenCookie = (res: NextResponse) =>
  res.cookies.set("refreshToken", "", {
    ...refreshTokenCookieOptions,
    maxAge: 0,
    expires: new Date(Date.now()),
  });

export const setUniqueIdentifierCookie = (
  res: NextResponse,
  uniqueId: string
) =>
  res.cookies.set({
    name: "uniqueIdentifier",
    value: uniqueId,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30 * 12 * 10, // 10 years
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 12 * 10 * 1000), // 10 years
    secure: getEnvAsBool("IS_PROD"),
  });

export const removeUniqueIdentifierCookie = (res: NextResponse) =>
  res.cookies.delete("uniqueIdentifier");

export const decodeAccessToken = (token: string): Token | undefined => {
  try {
    const decoded = jwt.verify(token, getEnvAsStr("SECRET_ATOKEN"));
    if (isToken(decoded)) return decoded;
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const refreshAndSetTokens = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const uniqueId = req.cookies.get("uniqueIdentifier")?.value;
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
  const { nanoId } = tokenContents.user;
  const userTokens = await redis.hgetall<Record<string, string>>(
    "refresh:" + nanoId
  );

  if (!userTokens)
    return logAndReturnGenericError("No user tokens", "unauthorized");
  const redisRToken = userTokens[uniqueId];
  console.log({ redisRToken });
  if (redisRToken !== refreshToken)
    return logAndReturnGenericError("Invalid token", "unauthorized");

  await deleteExpiredUserTokens({
    nanoId,
    tokens: userTokens,
  });

  const user = await getUserByNanoId(nanoId);

  if (!user) {
    return logAndReturnGenericError("No user found", "unauthorized");
  }

  const token = shapeToken(user);

  const accessToken = generateAccessToken(token);

  const newRefreshToken = generateRefreshToken(token);

  await addToList({
    refresher: newRefreshToken,
    uniqueId,
    nanoId: user.nanoId,
  });

  const res = NextResponse.json({
    success: true as const,
  });

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, newRefreshToken);

  return res;
};

export const createAndSetAuthTokens = async (
  req: NextRequest,
  res: NextResponse,
  user: InferSelectModel<typeof schema.user>
) => {
  const userAgent = req.headers.get("user-agent");
  if (!userAgent) throw new Error("No User Agent");
  const currentUniqueId = res.cookies.get("uniqueIdentifier")?.value;

  const token = shapeToken(user);

  const accessToken = generateAccessToken(token);

  const refreshToken = generateRefreshToken(token);

  const uniqueId = currentUniqueId ?? nanoid(16);

  await addToList({
    refresher: refreshToken,
    nanoId: user.nanoId,
    uniqueId,
  });

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
  setUniqueIdentifierCookie(res, uniqueId);
};

export const deleteExpiredUserTokens = async ({
  nanoId,
  tokens,
}: {
  nanoId: string;
  tokens: Record<string, string>;
}) => {
  const expiredTokens = Object.entries(tokens).filter(
    ([_, token]) => !decodeRefreshToken(token)
  );
  if (expiredTokens.length === 0) return;
  await redis.hdel("refresh:" + nanoId, ...expiredTokens.map(([id]) => id));
};
