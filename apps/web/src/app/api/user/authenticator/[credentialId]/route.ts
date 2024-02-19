import { authMiddleware, logAndReturnGenericError } from "@/server/serverUtils";
import {
  getAuthenticatorByCredentialId,
  getUserByNanoId,
  updateAuthenticator,
} from "@mbsm/db-layer";
import {
  EmptyResponse,
  isPatchUserAuthenticatorCredentialIdBody,
} from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { credentialId: string } }
): Promise<NextResponse<EmptyResponse>> => {
  const authRes = authMiddleware(req, true);
  if (authRes instanceof NextResponse) return authRes;

  const { token } = authRes;

  const user = await getUserByNanoId(token.user.nanoId);

  if (!user) return logAndReturnGenericError("User not found", "unauthorized");

  const { credentialId } = params;

  const body = await req.json();

  if (!isPatchUserAuthenticatorCredentialIdBody(body)) {
    return logAndReturnGenericError("Invalid body", "badRequest");
  }

  const { name } = body;

  const authenticator = await getAuthenticatorByCredentialId(credentialId);

  if (authenticator?.userId !== user.id) {
    return logAndReturnGenericError("Authenticator not found", "unauthorized");
  }

  await updateAuthenticator({
    id: authenticator.id,
    fields: {
      name,
    },
  });

  return NextResponse.json({ success: true });
};
