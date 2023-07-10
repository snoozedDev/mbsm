import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "./server/rateLimit";
import { getEnvAsBool } from "./utils/envUtils";

const IS_PROD = getEnvAsBool("IS_PROD");

export const middleware = async (req: NextRequest) => {
  // If we're in production, rate limit requests by IP address
  if (IS_PROD) {
    const { success } = await ratelimit.limit(req.ip || "_");
    if (!success) return new NextResponse("Too many requests", { status: 429 });
  }
  return NextResponse.next();
};
