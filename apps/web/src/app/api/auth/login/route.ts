import { loginLimiter } from "@/server/rateLimit";
import { getWebAuthnLoginOptions } from "@/utils/webAuthnUtils";
import type { GetAuthLoginResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

const getLogin = async (
  req: NextRequest
): Promise<NextResponse<GetAuthLoginResponse>> => {
  const limitRes = await loginLimiter.middleware(req);
  if (limitRes) return limitRes;
  const options = await getWebAuthnLoginOptions();
  return NextResponse.json({ success: true, options });
};

export { getLogin as GET };
