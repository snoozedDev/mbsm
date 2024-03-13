import {
  createAndSetAuthTokens,
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
} from "@/utils/tokenUtils";
import {
  getWebAuthnLoginOptions,
  getWebAuthnRegistrationOptions,
  getWebAuthnResponseForAuthentication,
  getWebAuthnResponseForRegistration,
} from "@/utils/webAuthnUtils";
import { db, getUserByEmail, schema } from "@mbsm/db-layer";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { validateInviteCode } from "../inviteCodeUtils";
import { signInLimiter, signUpLimiter } from "../rateLimit";
import {
  generateEmailVerificationCodeAndSend,
  logAndReturnGenericError,
} from "../serverUtils";
import { limiterMiddleware, router, webProcedure } from "../trpc";

export const authRouter = router({
  startSignup: webProcedure
    .use(limiterMiddleware(signUpLimiter))
    .input(
      z.object({
        email: z.string(),
        inviteCode: z.string(),
      })
    )
    .output(
      z.object({
        options: z.any(),
      })
    )
    .mutation(async ({ input: { email, inviteCode } }) => {
      const inviteCodeResponse = await validateInviteCode(inviteCode);
      if (inviteCodeResponse) {
        console.error("Invalid invite code");
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const id = randomUUID();

      const existingUser = await getUserByEmail(email);

      if (existingUser && existingUser.protected) {
        console.error("User already registered");
        throw new TRPCError({ code: "CONFLICT" });
      }

      const options = await getWebAuthnRegistrationOptions({
        userID: id,
        userName: email,
      });

      if (existingUser) {
        await db
          .update(schema.user)
          .set({
            currentRegChallenge: options.challenge,
          })
          .where(eq(schema.user.id, existingUser.id));
      } else {
        await db.insert(schema.user).values({
          role: "user",
          email,
          currentRegChallenge: options.challenge,
        });
      }

      return {
        options,
      };
    }),
  verifySignup: webProcedure
    .use(limiterMiddleware(signUpLimiter))
    .input(
      z.object({
        attRes: z.any(),
        email: z.string(),
        inviteCode: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { resHeaders, req },
        input: { attRes, email, inviteCode },
      }) => {
        const inviteCodeResponse = await validateInviteCode(inviteCode);
        if (inviteCodeResponse) {
          console.error("Invalid invite code");
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        const [user] = await db
          .select()
          .from(schema.user)
          .where(eq(schema.user.email, email));

        if (!user?.currentRegChallenge) {
          console.error("No challenge found");
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        if (user.protected) {
          return logAndReturnGenericError(
            "User already registered",
            "unauthorized"
          );
        }

        let verification;
        try {
          verification = await getWebAuthnResponseForRegistration({
            attRes,
            expectedChallenge: user.currentRegChallenge,
          });
        } catch (e) {
          console.error(e);
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const { verified, registrationInfo } = verification;

        if (!verified) {
          console.error("Verification failed");
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const {
          credentialPublicKey,
          credentialID,
          counter,
          credentialBackedUp,
          credentialDeviceType,
        } = registrationInfo!;

        try {
          await Promise.all([
            createAndSetAuthTokens(req, resHeaders, user),
            generateEmailVerificationCodeAndSend({
              email,
              userId: user.id,
            }),
            db.insert(schema.authenticator).values({
              credentialId: Buffer.from(credentialID).toString("base64url"),
              credentialPublicKey:
                Buffer.from(credentialPublicKey).toString("base64url"),
              credentialBackedUp,
              credentialDeviceType,
              counter,
              userId: user.id,
              transports: [].join(","),
              name: nanoid(16),
            }),
            db
              .update(schema.user)
              .set({ currentRegChallenge: null, protected: true })
              .where(eq(schema.user.id, user.id)),
            db
              .update(schema.inviteCode)
              .set({ redeemed: true })
              .where(eq(schema.inviteCode.code, inviteCode)),
          ]);
        } catch (e) {
          console.error(e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }
    ),
  startSignin: webProcedure
    .use(limiterMiddleware(signInLimiter))
    .output(
      z.object({
        options: z.any(),
      })
    )
    .mutation(async () => {
      const options = await getWebAuthnLoginOptions();
      return {
        options,
      };
    }),
  verifySignin: webProcedure
    .use(limiterMiddleware(signInLimiter))
    .input(
      z.object({
        attRes: z.any(),
      })
    )
    .mutation(async ({ ctx: { resHeaders, req }, input: { attRes } }) => {
      const authenticator = await db.query.authenticator.findFirst({
        where: ({ credentialId }, { eq }) => eq(credentialId, attRes.id),
        with: { user: true },
      });

      if (!authenticator) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That authenticator is not associated with any user.",
        });
      }

      const { user } = authenticator;

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That authenticator is not associated with any user.",
        });
      }

      await db
        .update(schema.user)
        .set({ currentRegChallenge: null })
        .where(eq(schema.user.id, user.id));

      const verification = await getWebAuthnResponseForAuthentication({
        attRes,
        authenticator,
      });

      const { verified, authenticationInfo } = verification;

      if (!verified || !authenticationInfo) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { newCounter } = authenticationInfo;

      await db
        .update(schema.authenticator)
        .set({ counter: newCounter })
        .where(
          eq(schema.authenticator.credentialId, authenticator.credentialId)
        );

      await createAndSetAuthTokens(req, resHeaders, user);
    }),
  signOut: webProcedure.mutation(async ({ ctx: { resHeaders } }) => {
    removeAccessTokenCookie(resHeaders);
    removeRefreshTokenCookie(resHeaders);
  }),
});
