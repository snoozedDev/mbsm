import { refreshAndSetTokens } from "@/utils/tokenUtils";
import { GetAuthRefreshResponse } from "@mbsm/types";

import { NextRequest, NextResponse } from "next/server";

const refreshAuthToken = async (
  req: NextRequest
): Promise<NextResponse<GetAuthRefreshResponse>> =>
  await refreshAndSetTokens(req);

export { refreshAuthToken as GET };

export const dynamic = "force-dynamic";
