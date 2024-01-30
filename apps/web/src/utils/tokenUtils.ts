import { ApiRoute, OkLiteralSchema } from "@/lib/validators/validatorUtils";
import {
  InferSelectModel,
  getUserByNanoId,
  redis,
  schema,
} from "@mbsm/db-layer";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema, z } from "zod";
import { getFormattedZodError, getZodTypeGuard } from "./zodUtils";

const TokenSchema = z.object({
  user: z.object({
    username: z.string(),
    userNanoId: z.string(),
  }),
  userAgent: z.string(),
  level: z.union([z.literal("user"), z.literal("admin")]),
});

const isToken = getZodTypeGuard(TokenSchema);

export type Token = z.infer<typeof TokenSchema>;

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

export const getAccessTokenCookie = (token: string) => ({
  name: "accessToken",
  value: token,
  httpOnly: true,
  path: "/",
  maxAge: 60 * 15, // 15 minutes
  expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
  secure: getEnvAsBool("IS_PROD"),
});

export const removeAccessTokenCookie = (res: NextResponse) => {
  res.cookies.set({
    name: "accessToken",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: getEnvAsBool("IS_PROD"),
  });
};

export const getRefreshTokenCookie = (token: string) => ({
  name: "refreshToken",
  value: token,
  httpOnly: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  secure: getEnvAsBool("IS_PROD"),
});

export const removeRefreshTokenCookie = (res: NextResponse) => {
  res.cookies.set({
    name: "refreshToken",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: getEnvAsBool("IS_PROD"),
  });
};

export const getUniqueIdentifierCookie = (uniqueId: string) => ({
  name: "uniqueIdentifier",
  value: uniqueId,
  httpOnly: true,
  path: "/",
  // forever
  maxAge: 60 * 60 * 24 * 30 * 12 * 10, // 10 years
  expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 12 * 10 * 1000), // 10 years
  secure: getEnvAsBool("IS_PROD"),
});

export const removeUniqueIdentifierCookie = (res: NextResponse) => {
  res.cookies.set({
    name: "uniqueIdentifier",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: getEnvAsBool("IS_PROD"),
  });
};

export const decodeAccessToken = (token: string): Token | undefined => {
  try {
    const decoded = jwt.verify(token, getEnvAsStr("SECRET_ATOKEN"));
    if (isToken(decoded)) return decoded;
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const refreshAndSetTokens = async () => {
  const authError = new Error("Unauthorized");
  const refreshToken = cookies().get("refreshToken")?.value;
  const uniqueId = cookies().get("uniqueIdentifier")?.value;
  const userAgent = headers().get("user-agent");
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

    cookies().set(getAccessTokenCookie(accessToken));
    cookies().set(getRefreshTokenCookie(newRefreshToken));

    return { token };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const routeWithAuth =
  <
    RV extends
      | ApiRoute<
          "GET" | "POST",
          ZodSchema | undefined,
          ZodSchema | undefined,
          ZodSchema | OkLiteralSchema
        >
      | undefined = undefined,
    A extends boolean | undefined = undefined,
  >({
    handler,
    routeValidator,
    authRequired,
  }: {
    handler: (params: {
      req: NextRequest;
      token: A extends true ? Token : undefined;
      user: A extends true ? InferSelectModel<typeof schema.user> : undefined;
      ctx: {
        params: RV extends ApiRoute<"GET" | "POST", infer P>
          ? P extends ZodSchema
            ? z.infer<P>
            : any
          : any;
        body: RV extends ApiRoute<"POST", ZodSchema | undefined, infer RB>
          ? RB extends ZodSchema
            ? z.infer<RB>
            : undefined
          : undefined;
      };
    }) => Promise<
      | (RV extends ApiRoute<
          "GET" | "POST",
          ZodSchema | undefined,
          ZodSchema | undefined,
          infer RSB
        >
          ? RSB extends ZodSchema
            ? z.infer<RSB>
            : "OK"
          : any)
      | NextResponse
    >;
    routeValidator?: RV;
    authRequired?: A;
  }) =>
  async (req: NextRequest, { params }: { params: unknown }) => {
    const accessToken = req.cookies.get("accessToken");

    let tokenContents: Token | undefined;
    if (accessToken) {
      tokenContents = decodeAccessToken(accessToken.value);
    }

    if (authRequired && !tokenContents) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let user: InferSelectModel<typeof schema.user> | undefined = undefined;

    if (tokenContents) {
      user = await getUserByNanoId(tokenContents.user.userNanoId);
    }

    if (routeValidator?.paramsSchema) {
      const validateParams = getZodTypeGuard(routeValidator.paramsSchema);
      if (!validateParams(params)) {
        return new NextResponse("Bad Request", { status: 400 });
      }
    }

    let body = undefined;

    if (
      routeValidator &&
      routeValidator.method === "POST" &&
      routeValidator.requestBodySchema
    ) {
      body = await req.json();
      const validateResult = routeValidator.requestBodySchema.safeParse(body);
      if (!validateResult.success) {
        const errorMessage = getFormattedZodError(validateResult.error);
        return new NextResponse(errorMessage, {
          status: 400,
        });
      }
    }

    try {
      const result = await handler({
        req,
        token: tokenContents as A extends true ? Token : undefined,
        user: user as A extends true
          ? InferSelectModel<typeof schema.user>
          : undefined,
        ctx: {
          params: params as RV extends ApiRoute<"GET" | "POST", infer P>
            ? P extends ZodSchema
              ? z.infer<P>
              : {}
            : {},
          body: body as RV extends ApiRoute<
            "POST",
            ZodSchema | undefined,
            infer RB
          >
            ? RB extends ZodSchema
              ? z.infer<RB>
              : undefined
            : undefined,
        },
      });

      if (result instanceof NextResponse) return result;

      if (routeValidator?.responseBodySchema) {
        const validateResponse = getZodTypeGuard(
          routeValidator.responseBodySchema
        );
        if (!validateResponse(result)) {
          console.error("Invalid Response: ", result);
          return new NextResponse("Internal Server Error", { status: 500 });
        }
      }

      return result === "OK"
        ? new NextResponse("OK")
        : NextResponse.json(result);
    } catch (error) {
      if (error instanceof NextResponse) return error;
      console.error("Unhandled Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };

export const createAndSetAuthTokens = async (
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

  cookies().set(getAccessTokenCookie(accessToken));
  cookies().set(getRefreshTokenCookie(refreshToken));
  cookies().set(getUniqueIdentifierCookie(uniqueId));
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
