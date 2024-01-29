import { routeWithAuth } from "@/utils/tokenUtils";
import {
  getWebAuthnRegistrationOptions,
  getWebAuthnResponseForRegistration,
} from "@/utils/webAuthnUtils";
import { db, getAuthenticatorsForUser, schema } from "@mbsm/db-layer";
import { Authenticator } from "@mbsm/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = routeWithAuth({
  authRequired: true,
  handler: async ({ user }) => {
    const userAuthenticators = await getAuthenticatorsForUser(user.id);

    const regOptions = getWebAuthnRegistrationOptions({
      userID: user.nanoId,
      userName: user.email,
      excludeCredentials: userAuthenticators,
    });

    await db
      .update(schema.user)
      .set({ currentRegChallenge: regOptions.challenge })
      .where(eq(schema.user.id, user.id));

    return NextResponse.json({ regOptions });
  },
});

export const PUT = routeWithAuth({
  authRequired: true,
  handler: async ({ req, user }) => {
    const { attRes } = await req.json();

    if (!attRes || !user.currentRegChallenge) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const verification = await getWebAuthnResponseForRegistration({
      attRes,
      expectedChallenge: user.currentRegChallenge,
    });

    const { verified, registrationInfo } = verification;

    await db
      .update(schema.user)
      .set({ currentRegChallenge: null })
      .where(eq(schema.user.id, user.id));

    if (!verified || !registrationInfo) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      credentialPublicKey,
      credentialID,
      counter,
      credentialBackedUp,
      credentialDeviceType,
    } = registrationInfo;

    const now = new Date();
    const credentialId = Buffer.from(credentialID).toString("base64url");
    const name = nanoid(16);

    await db.insert(schema.authenticator).values({
      counter,
      credentialBackedUp,
      credentialDeviceType,
      credentialId,
      credentialPublicKey:
        Buffer.from(credentialPublicKey).toString("base64url"),
      name,
      transports: [].join(","),
      userId: user.id,
    });

    const authenticator: Authenticator = {
      addedAt: now.toUTCString(),
      credentialId,
      name,
    };

    return NextResponse.json({ authenticator });
  },
});
