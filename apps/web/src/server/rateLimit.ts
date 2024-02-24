import { Ratelimit, RatelimitConfig, redis } from "@mbsm/db-layer";

const createRateLimiter = (opts: RatelimitConfig) => {
  const rateLimiter = new Ratelimit(opts);

  const middleware = async (req: Request): Promise<boolean> => {
    const ip = req.headers.get("cf-connecting-ip") || "_";
    const { success } = await rateLimiter.limit(ip);
    return success;
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

export type RateLimiter = ReturnType<typeof createRateLimiter>;
