import { routes } from "@/server/routers";
import { routeWithAuth } from "@/utils/tokenUtils";
import { getEnvAsStr } from "@mbsm/utils";
import { NextResponse } from "next/server";

export const GET = routeWithAuth({
  routeValidator: routes.processUserInviteCodesCron,
  handler: async ({ ctx: { params } }) => {
    if (params.code !== getEnvAsStr("CRON_CODE")) {
      return "OK";
    } else {
      return new NextResponse(undefined, { status: 404 });
    }
  },
});
