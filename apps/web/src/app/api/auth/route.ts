import { authMiddleware } from "@/server/serverUtils";
import { GetAuthResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

const getAuth = async (
  req: NextRequest
): Promise<NextResponse<GetAuthResponse>> => {
  const authRes = authMiddleware(req, true);
  if (authRes instanceof NextResponse) return authRes;

  return NextResponse.json({
    success: true as const,
    accessToken: authRes.accessToken,
  });
};

export { getAuth as GET };
