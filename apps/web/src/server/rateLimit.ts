import { Ratelimit, RatelimitConfig, redis } from "@mbsm/db-layer";

const createRateLimiter = (opts: RatelimitConfig) => {
  const rateLimiter = new Ratelimit(opts);

  const middleware = async (req: Request): Promise<boolean> => {
    const ip = req.headers.get("x-real-ip") || "_";
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

export const signUpLimiter = createRateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(6, "1 h"),
  analytics: true,
  prefix: "@mbsm/signUp",
});

export const signInLimiter = createRateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(10, "30 m"),
  analytics: true,
  prefix: "@mbsm/signIn",
});

export type RateLimiter = ReturnType<typeof createRateLimiter>;
