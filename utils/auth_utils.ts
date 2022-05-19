import { defaults, seal, unseal } from "@hapi/iron";
import { parse, serialize } from "cookie";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { Middleware } from "next-connect";
import { dbClient } from "../db/prisma_client";
import { mbsmSession } from "../types/auth_types";
import { environment } from "./env_utils";

const { SESSION_NAME, SESSION_SECRET, NODE_ENV } = environment;

const TOKEN_NAME = SESSION_NAME;
const MAX_AGE = (1000 * 60 * 60 * 24) / 60; // 24 hours

export const setTokenCookie = (
  res: NextApiResponse,
  token: string,
  age = MAX_AGE
) => {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + age),
    httpOnly: true,
    secure: NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const renewTokenCookie: NextApiHandler = (req, res) => {
  const token = getTokenCookie(req);
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE),
    httpOnly: true,
    secure: NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const parseCookies = (req: NextApiRequest) => {
  if (req.cookies) return req.cookies;

  const cookie = req.headers?.cookie;
  return parse(cookie || "");
};

export const getTokenCookie = (req: NextApiRequest) => {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
};

export const encryptSession = (session: mbsmSession) => {
  return seal(session, SESSION_SECRET, defaults);
};

export const getSession = async (
  req: NextApiRequest
): Promise<mbsmSession | null> => {
  const token = getTokenCookie(req);
  if (!token) return null;
  const session = unseal(token, SESSION_SECRET, defaults);
  if (!session) return null;
  return session;
};

export const authMiddleware: Middleware<
  NextApiRequest,
  NextApiResponse
> = async (req, res, next) => {
  user: try {
    const session = await getSession(req);
    if (!session) {
      break user;
    }
    const user = await dbClient.users.findUnique({
      where: { id: session.currentUserId },
      include: { accounts: true },
    });
    if (!user || !user.accounts) {
      removeTokenCookie(res);
      break user;
    }
    const { accounts, ...finalUser } = user;
    req.user = {
      ...finalUser,
      account: accounts,
    };
    return next();
  } catch (e) {
    console.log(e);
  }
  return res.send({ success: false, error: "Unauthenticated." });
};
