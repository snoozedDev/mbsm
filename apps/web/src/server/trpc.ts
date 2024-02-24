import { Token } from "@mbsm/types";
import { getEnvAsStr } from "@mbsm/utils";
import { TRPCError, initTRPC } from "@trpc/server";
import { RateLimiter } from "./rateLimit";

type Context = {
  token?: Token;
  resHeaders?: Headers;
  req?: Request;
  serverSecret?: string;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const webProcedure = publicProcedure.use(async function isWeb(opts) {
  const { resHeaders, req } = opts.ctx;

  if (!req || !resHeaders) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      resHeaders,
      req,
    },
  });
});

export const authedProcedure = webProcedure.use(async function isAuthed(opts) {
  const { token } = opts.ctx;
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      token,
    },
  });
});

export const serverProcedure = publicProcedure.use(
  async function isServer(opts) {
    const { serverSecret } = opts.ctx;
    console.log({ serverSecret });

    if (!serverSecret) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (serverSecret !== getEnvAsStr("SERVER_PROCEDURE_SECRET")) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return opts.next({
      ctx: {
        serverSecret,
      },
    });
  }
);

export const limiterMiddleware = (limiter: RateLimiter) =>
  t.middleware(async function withLimiter(opts) {
    const { req } = opts.ctx;
    if (!req) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const success = await limiter.middleware(req);
    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }

    return opts.next();
  });
