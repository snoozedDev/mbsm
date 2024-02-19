import { authMiddleware, logAndReturnGenericError } from "@/server/serverUtils";
import { getUserById } from "@mbsm/db-layer";
import { GetUserMeResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

const getUserMe = async (
  req: NextRequest
): Promise<NextResponse<GetUserMeResponse>> => {
  const authRes = authMiddleware(req, true);
  if (authRes instanceof NextResponse) return authRes;
  const user = await getUserById(authRes.token.user.id);

  if (!user) return logAndReturnGenericError("User not found", "unauthorized");

  return NextResponse.json({
    success: true,
    email: user.email,
    emailVerified: user.emailVerified,
  });
};

export { getUserMe as GET };
