import { routeWithAuth } from "@/utils/tokenUtils";
import {
  getAuthenticatorByCredentialId,
  updateAuthenticatorName,
} from "@mbsm/db-layer";
import { NextResponse } from "next/server";

export const PATCH = routeWithAuth({
  authRequired: true,
  handler: async ({ req, user, ctx }) => {
    const { credentialId } = ctx.params;
    const { name } = await req.json();

    const authenticator = await getAuthenticatorByCredentialId(credentialId);

    if (authenticator?.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await updateAuthenticatorName({
      name,
      id: authenticator.id,
    });

    return new NextResponse("OK");
  },
});
