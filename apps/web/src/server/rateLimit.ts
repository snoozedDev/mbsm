import { Ratelimit, RatelimitConfig, redis } from "@mbsm/db-layer";
import { headers } from "next/headers";

const createRateLimiter = (opts: RatelimitConfig) => {
  const rateLimiter = new Ratelimit(opts);

  const middleware = async () => {
    const headerStore = headers();
    const ip = headerStore.get("cf-connecting-ip");
    const { success } = await rateLimiter.limit(ip || "_");
    if (!success) return new Error("Too many requests");
    return undefined;
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
