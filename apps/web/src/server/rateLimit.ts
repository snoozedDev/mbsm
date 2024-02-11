import { Ratelimit, RatelimitConfig, redis } from "@mbsm/db-layer";
import { NextRequest } from "next/server";
import { logAndReturnGenericError } from "./serverUtils";

const createRateLimiter = (opts: RatelimitConfig) => {
  const rateLimiter = new Ratelimit(opts);

  const middleware = async (req: NextRequest) => {
    const ip = req.headers.get("cf-connecting-ip") || "_";
    const { success } = await rateLimiter.limit(ip);
    console.log("success", success);
    if (success) return undefined;
    return logAndReturnGenericError("Rate limit exceeded", "unauthorized");
  };

  return { rateLimiter, middleware };
};

export const globalLimiter = createRateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(50, "10 s"),
  analytics: true,
  prefix: "@mbsm/global",
});

export const registerLimiter = createRateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 m"),
  analytics: true,
  prefix: "@mbsm/register",
});

export const loginLimiter = createRateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 m"),
  analytics: true,
  prefix: "@mbsm/login",
});
