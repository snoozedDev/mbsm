import { MiddlewareConfig } from "next/dist/build/analysis/get-page-static-info";
import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "./server/rateLimit";
import { getEnvAsBool } from "./utils/envUtils";

const IS_PROD = getEnvAsBool("IS_PROD");

export const middleware = async (req: NextRequest) => {
  // If we're in production and request is not cached, rate limit requests by IP address
  const isApi = req.nextUrl.pathname.startsWith("/api");
  if (IS_PROD && isApi) {
    const { success } = await ratelimit.limit(req.ip || "_");
    if (!success) return new NextResponse("Too many requests", { status: 429 });
  }
  return NextResponse.next();
};

export const config: MiddlewareConfig = {
  regions: ["server"],
};
