import { refreshAndSetTokens } from "@/utils/tokenUtils";

import { NextRequest } from "next/server";

const refreshAuthToken = async (req: NextRequest) =>
  await refreshAndSetTokens(req);

export { refreshAuthToken as GET };

export const dynamic = "force-dynamic";
