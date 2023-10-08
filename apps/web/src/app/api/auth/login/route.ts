import { loginLimiter } from "@/server/rateLimit";
import { getWebAuthnLoginOptions } from "@/utils/webAuthnUtils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const limitRes = await loginLimiter.middleware(req);
  if (limitRes) return limitRes;
  const options = getWebAuthnLoginOptions();
  return NextResponse.json({ options });
};
