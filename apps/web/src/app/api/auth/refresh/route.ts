import { logAndReturnGenericError } from "@/server/serverUtils";
import { refreshAndSetTokens } from "@/utils/tokenUtils";
import { EmptyResponse } from "@mbsm/types";

import { NextRequest, NextResponse } from "next/server";

const refreshAuthToken = async (
  req: NextRequest
): Promise<NextResponse<EmptyResponse>> => {
  const res = NextResponse.json({ success: true as const });

  try {
    await refreshAndSetTokens(req, res);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return logAndReturnGenericError(e, "unauthorized");
  }

  return res;
};

export { refreshAuthToken as GET };

export const dynamic = "force-dynamic";
