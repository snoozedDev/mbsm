import { refreshAndSetTokens } from "@/utils/tokenUtils";

import { NextRequest, NextResponse } from "next/server";

const refreshAuthToken = async (req: NextRequest) => {
  const res = new NextResponse("OK", { status: 200 });

  try {
    await refreshAndSetTokens(req, res);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    console.log("refreshAuthToken", e);
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return res;
};

export { refreshAuthToken as GET };

export const dynamic = "force-dynamic";
