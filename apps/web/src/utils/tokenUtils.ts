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
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

export const setAccessTokenCookie = (res: NextResponse, token: string) =>
  res.cookies.set({
    name: "accessToken",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 15, // 15 minutes
    expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
    secure: getEnvAsBool("IS_PROD"),
  });

export const removeAccessTokenCookie = (res: NextResponse) =>
  res.cookies.delete("accessToken");

export const setRefreshTokenCookie = (res: NextResponse, token: string) =>
  res.cookies.set({
    name: "refreshToken",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    secure: getEnvAsBool("IS_PROD"),
  });

export const removeRefreshTokenCookie = (res: NextResponse) =>
  res.cookies.delete("refreshToken");

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

export const refreshAndSetTokens = async (
  req: NextRequest,
  res: NextResponse
) => {
  const authError = new NextResponse("Unauthorized", { status: 401 });
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const uniqueId = req.cookies.get("uniqueIdentifier")?.value;
  const userAgent = req.headers.get("user-agent");
  if (!refreshToken || !uniqueId || !userAgent) throw authError;
  const tokenContents = decodeRefreshToken(refreshToken);
  if (!tokenContents) throw authError;
  try {
    const userTokens = await redis.hgetall<Record<string, string>>(
      "refresh:" + tokenContents.user.userNanoId
    );

    if (!userTokens) throw authError;
    const redisRToken = userTokens[uniqueId];
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
      uniqueId,
      userNanoId: user.nanoId,
    });

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    return { token };
  } catch (error) {
    throw error;
  }
};

export const createAndSetAuthTokens = async (
  res: NextResponse,
  user: InferSelectModel<typeof schema.user>
) => {
  const userAgent = headers().get("user-agent");
  if (!userAgent) throw new Error("No User Agent");
  const currentUniqueId = cookies().get("uniqueIdentifier")?.value;

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

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
  setUniqueIdentifierCookie(res, uniqueId);
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
