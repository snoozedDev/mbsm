import {
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
} from "@/utils/tokenUtils";
import { EmptyResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest
): Promise<NextResponse<EmptyResponse>> => {
  const res = NextResponse.json({ success: true as const });
  removeAccessTokenCookie(res);
  removeRefreshTokenCookie(res);
  return res;
};

export const dynamic = "force-dynamic";
