import { authMiddleware, logAndReturnGenericError } from "@/server/serverUtils";
import { db, updateAuthenticator } from "@mbsm/db-layer";
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
  const { credentialId } = params;

  const body = await req.json();

  if (!isPatchUserAuthenticatorCredentialIdBody(body)) {
    return logAndReturnGenericError("Invalid body", "badRequest");
  }

  const user = await db.query.user.findFirst({
    where: ({ id }, { eq }) => eq(id, token.user.id),
    with: { authenticators: true },
  });

  if (!user) return logAndReturnGenericError("User not found", "unauthorized");

  const { name } = body;

  const authenticator = user.authenticators.find(
    (authenticator) => authenticator.credentialId === credentialId
  );

  if (!authenticator)
    return logAndReturnGenericError("Authenticator not found", "notFound");

  await updateAuthenticator({
    id: authenticator.id,
    fields: { name },
  });

  return NextResponse.json({ success: true });
};
