import { authMiddleware, logAndReturnGenericError } from "@/server/serverUtils";
import { getUserByNanoId } from "@mbsm/db-layer";
import { GetUserMeResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

const getUserMe = async (
  req: NextRequest
): Promise<NextResponse<GetUserMeResponse>> => {
  const authRes = authMiddleware(req, true);
  if (authRes instanceof NextResponse) return authRes;
  const user = await getUserByNanoId(authRes.token.user.nanoId);

  if (!user) return logAndReturnGenericError("User not found", "unauthorized");

  return NextResponse.json({
    success: true,
    email: user.email,
    emailVerified: user.emailVerified,
  });
};

export { getUserMe as GET };
