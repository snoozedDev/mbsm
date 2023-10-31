import { ApiRoute } from "@/lib/validators/validatorUtils";
import {
  routeWithAuth,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  tokenRefresh,
} from "@/utils/tokenUtils";
import { NextResponse } from "next/server";

export const GET = routeWithAuth({
  routeValidator: new ApiRoute({
    route: "/auth/refresh",
  }),
  handler: async ({ req }) => {
    const { accessToken, newRefreshToken } = await tokenRefresh(req);

    const response = new NextResponse("OK", { status: 200 });

    setAccessTokenCookie(accessToken, response);
    setRefreshTokenCookie(newRefreshToken, response);

    return response;
  },
});

export const dynamic = "force-dynamic";
