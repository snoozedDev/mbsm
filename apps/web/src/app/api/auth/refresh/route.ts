import { refreshAndSetTokens } from "@/utils/tokenUtils";
import { EmptyResponse } from "@mbsm/types";

import { NextRequest, NextResponse } from "next/server";

const refreshAuthToken = async (
  req: NextRequest
): Promise<NextResponse<EmptyResponse>> => await refreshAndSetTokens(req);

export { refreshAuthToken as GET };

export const dynamic = "force-dynamic";
