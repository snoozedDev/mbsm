import { loginLimiter } from "@/server/rateLimit";
import { getWebAuthnLoginOptions } from "@/utils/webAuthnUtils";
import type { GetAuthSignInResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<GetAuthSignInResponse>> => {
  const limitRes = await loginLimiter.middleware(req);
  if (limitRes) return limitRes;
  const options = await getWebAuthnLoginOptions();
  return NextResponse.json({ success: true, options });
};
