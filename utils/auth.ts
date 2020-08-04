import { defaults, seal, unseal } from "@hapi/iron";
import { parse, serialize } from "cookie";
import { Middleware } from "next-connect";
import { User } from "../db/models/user";
import { environment } from "./env";
import { mbsmSession } from "./types";

const { SESSION_NAME, SESSION_SECRET, NODE_ENV } = environment;

const TOKEN_NAME = SESSION_NAME;
const MAX_AGE = (1000 * 60 * 60 * 8) / 60; // 8 hours

export const setTokenCookie = (res, token, age = MAX_AGE) => {
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

export const renewTokenCookie = (req, res) => {
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

export const removeTokenCookie = (res) => {
  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const parseCookies = (req) => {
  if (req.cookies) return req.cookies;

  const cookie = req.headers?.cookie;
  return parse(cookie || "");
};

export const getTokenCookie = (req) => {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
};

export const encryptSession = (session: mbsmSession) => {
  return seal(session, SESSION_SECRET, defaults);
};

export const getSession = async (req): Promise<mbsmSession | null> => {
  const token = getTokenCookie(req);
  if (!token) return null;
  const session = unseal(token, SESSION_SECRET, defaults);
  if (!session) return null;
  return session;
};

export const authMiddleware: Middleware = async (req: any, res, next) => {
  user: try {
    const session = await getSession(req);
    if (!session) {
      break user;
    }
    const user = await User.getByUsernameComplete(session.username);
    if (!user) {
      removeTokenCookie(req);
      break user;
    }
    req.user = user;
    return next();
  } catch (e) {
    console.log(e);
  }
  return res.send({ success: false, error: "Unauthenticated." });
};
