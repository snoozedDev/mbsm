import { codeFormSchema } from "@/lib/shemas/forms/codeFormSchema";
import { generateInviteCodes } from "@/utils/inviteCodeUtils";
import {
  getWebAuthnRegistrationOptions,
  getWebAuthnResponseForRegistration,
} from "@/utils/webAuthnUtils";
import {
  db,
  getUserById,
  insertInviteCodes,
  schema,
  updateAuthenticator,
} from "@mbsm/db-layer";
import {
  AccountCreationFormSchema,
  Authenticator,
  AuthenticatorSchema,
  InviteCode,
  InviteCodeSchema,
  UserAccountSchema,
} from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  deleteEmailVerificationCode,
  getEmailVerificationCodeForUser,
} from "../serverUtils";
import { authedProcedure, router } from "../trpc";

export const userRouter = router({
  me: authedProcedure
    .output(
      z.object({
        email: z.string(),
        emailVerified: z.boolean(),
        accounts: UserAccountSchema.array(),
      })
    )
    .query(async ({ ctx }) => {
      const user = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, ctx.token.user.id),
        with: { accounts: { with: { avatar: true } } },
      });

      console.log(user?.accounts);

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      return {
        email: user.email,
        emailVerified: user.emailVerified,
        accounts: user.accounts,
      };
    }),
  verifyEmail: authedProcedure
    .input(codeFormSchema)
    .mutation(async ({ ctx: { token }, input: { code } }) => {
      const [user, storedCode] = await Promise.all([
        getUserById(token.user.id),
        getEmailVerificationCodeForUser(token.user.id),
      ]);

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user?.emailVerified) return;

      if (
        !getEnvAsBool("IS_PROD") &&
        code === getEnvAsStr("DEV_VERIFICATION_CODE")
      ) {
        code = storedCode;
      }

      if (code !== storedCode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification code is invalid.",
        });
      }

      await Promise.all([
        db
          .update(schema.user)
          .set({ emailVerified: true })
          .where(eq(schema.user.id, user.id)),
        deleteEmailVerificationCode({ userId: user.id }),
      ]);
    }),
  settings: authedProcedure
    .output(
      z.object({
        authenticators: AuthenticatorSchema.array(),
        inviteCodes: InviteCodeSchema.array(),
      })
    )
    .query(async ({ ctx: { token } }) => {
      const user = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, token.user.id),
        with: { authenticators: true, inviteCodes: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const { authenticators, inviteCodes } = user;

      let finalAuthenticators: Authenticator[] = authenticators.map(
        (authenticator) => ({
          credentialId: authenticator.credentialId,
          name: authenticator.name,
          addedAt: authenticator.createdAt.toISOString(),
        })
      );

      let finalInviteCodes: InviteCode[] = inviteCodes.map((inviteCode) => ({
        code: inviteCode.code,
        redeemed: inviteCode.redeemed,
      }));

      if (finalInviteCodes.length === 0 && user.emailVerified) {
        finalInviteCodes = generateInviteCodes(5);
        try {
          await insertInviteCodes({
            inviteCodes: finalInviteCodes,
            userId: user.id,
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate invite codes",
            cause: error,
          });
        }
      }

      return {
        authenticators: finalAuthenticators,
        inviteCodes: finalInviteCodes,
      };
    }),
  updateAuthenticator: authedProcedure
    .input(
      z.object({
        name: z.string(),
        credentialId: z.string(),
      })
    )
    .mutation(async ({ input: { name, credentialId }, ctx: { token } }) => {
      const user = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, token.user.id),
        with: { authenticators: true },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const authenticator = user.authenticators.find(
        (authenticator) => authenticator.credentialId === credentialId
      );

      if (!authenticator)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Authenticator not found",
        });

      await updateAuthenticator({
        id: authenticator.id,
        fields: { name },
      });
    }),
  startAddAuthenticator: authedProcedure
    .output(z.object({ options: z.any() }))
    .mutation(async ({ ctx: { token } }) => {
      const user = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, token.user.id),
        with: { authenticators: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      const { authenticators } = user;

      const options = await getWebAuthnRegistrationOptions({
        userID: user.id,
        userName: user.email,
        excludeCredentials: authenticators,
      });

      await db
        .update(schema.user)
        .set({ currentRegChallenge: options.challenge })
        .where(eq(schema.user.id, user.id));

      return { options };
    }),
  verifyAddAuthenticator: authedProcedure
    .output(z.object({ authenticator: AuthenticatorSchema }))
    .input(z.object({ attRes: z.any() }))
    .mutation(async ({ input: { attRes }, ctx: { token } }) => {
      const user = await getUserById(token.user.id);

      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (!user.currentRegChallenge) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const verification = await getWebAuthnResponseForRegistration({
        attRes,
        expectedChallenge: user.currentRegChallenge,
      });

      const { verified, registrationInfo } = verification;

      if (!verified || !registrationInfo) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
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

      await Promise.all([
        db
          .update(schema.user)
          .set({ currentRegChallenge: null })
          .where(eq(schema.user.id, user.id)),
        db.insert(schema.authenticator).values({
          counter,
          credentialBackedUp,
          credentialDeviceType,
          credentialId,
          credentialPublicKey:
            Buffer.from(credentialPublicKey).toString("base64url"),
          name,
          transports: [].join(","),
          userId: user.id,
        }),
      ]);

      const authenticator: Authenticator = {
        addedAt: now.toUTCString(),
        credentialId,
        name,
      };

      return { authenticator };
    }),
  createAccount: authedProcedure
    .input(AccountCreationFormSchema)
    .mutation(async ({ input, ctx: { token } }) => {
      try {
        await db.insert(schema.account).values({
          ...input,
          userId: token.user.id,
        });
      } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "23505") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Handle already in use",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account",
        });
      }
    }),
});
