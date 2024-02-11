import { decodeAccessToken, refreshAndSetTokens } from "@/utils/tokenUtils";
import { getUserByNanoId } from "@mbsm/db-layer";
import { UserMeResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

const getUserMe = async (
  req: NextRequest
): Promise<NextResponse<UserMeResponse>> => {
  const res = new NextResponse();
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const tokenContents = accessToken
      ? decodeAccessToken(accessToken)
      : (await refreshAndSetTokens(req, res)).token;

    if (!tokenContents) throw "No token found.";

    const user = await getUserByNanoId(tokenContents.user.userNanoId);
    if (!user) throw "No user found for token. This should never happen.";

    return NextResponse.json({
      success: true,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (e) {
    console.log("getUserMe", e);
    return new NextResponse("Unauthorized", { status: 401 });
  }
};

export { getUserMe as GET };
