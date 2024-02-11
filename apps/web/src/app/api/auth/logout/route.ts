import {
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
} from "@/utils/tokenUtils";
import { getEnvAsStr } from "@mbsm/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const res = NextResponse.redirect(getEnvAsStr("ORIGIN") + "/");
  removeAccessTokenCookie(res);
  removeRefreshTokenCookie(res);
  return res;
};
