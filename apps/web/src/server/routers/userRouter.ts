import { codeFormSchema } from "@/lib/shemas/forms/codeFormSchema";
import { generateInviteCodesForUser } from "@/utils/inviteCodeUtils";
import { UploadClientPayloadSchema } from "@/utils/uploadUtils";
import {
  getWebAuthnRegistrationOptions,
  getWebAuthnResponseForRegistration,
} from "@/utils/webAuthnUtils";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  db,
  getUserById,
  insertInviteCodes,
  schema,
  updateAccount,
  updateAuthenticator,
  updateFile,
} from "@mbsm/db-layer";
import {
  AccountCreationFormSchema,
  FileMetadata,
  UserFacingAccountSchema,
  UserFacingAuthenticator,
  UserFacingAuthenticatorSchema,
  UserFacingFileSchema,
  UserFacingInviteCodeSchema,
  UserFacingUserSchema,
} from "@mbsm/types";
import {
  getEnvAsBool,
  getEnvAsStr,
  toUserFacingAccount,
  toUserFacingAuthenticator,
  toUserFacingFile,
  toUserFacingInviteCode,
  toUserFacingUser,
} from "@mbsm/utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { z } from "zod";
import { uploadLimiter } from "../rateLimit";
import {
  deleteEmailVerificationCode,
  getEmailVerificationCodeForUser,
} from "../serverUtils";
import { authedProcedure, limiterMiddleware, router } from "../trpc";

const getTotalFilesSizeKB = (files: (typeof schema.file.$inferSelect)[]) =>
  files.filter((f) => f.uploadedAt).reduce((acc, f) => acc + f.sizeKB, 0);

const s3 = new S3Client({
  region: getEnvAsStr("AWS_REGION"),
  credentials: {
    accessKeyId: getEnvAsStr("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getEnvAsStr("AWS_SECRET_ACCESS_KEY"),
  },
  // old as shit
  // https://awsdocs.s3.amazonaws.com/S3/20060301/s3-dg-20060301.pdf
  apiVersion: "2006-03-01",
});

export const userRouter = router({
  me: authedProcedure
    .output(
      z.object({
        user: UserFacingUserSchema,
        accounts: UserFacingAccountSchema.array(),
      })
    )
    .query(async ({ ctx }) => {
      const result = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, ctx.token.user.id),
        with: { accounts: { with: { avatar: true } } },
      });

      if (!result)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const { accounts, ...user } = result;

      console.log({ accounts, user });

      console.log({
        response: {
          user: toUserFacingUser({ user }),
          accounts: accounts.map(({ avatar, ...account }) =>
            toUserFacingAccount({ account, avatar })
          ),
        },
      });

      return {
        user: toUserFacingUser({ user }),
        accounts: accounts.map(({ avatar, ...account }) =>
          toUserFacingAccount({ account, avatar })
        ),
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
        authenticators: UserFacingAuthenticatorSchema.array(),
        inviteCodes: UserFacingInviteCodeSchema.array(),
        files: UserFacingFileSchema.array(),
      })
    )
    .query(async ({ ctx: { token } }) => {
      const result = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, token.user.id),
        with: {
          authenticators: true,
          inviteCodes: true,
          files: {
            where: (files, { and, isNotNull, isNull }) =>
              and(isNull(files.deletedAt), isNotNull(files.uploadedAt)),
          },
        },
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const { authenticators, inviteCodes, files, ...user } = result;

      let finalInviteCodes = inviteCodes;

      if (inviteCodes.length === 0 && user.emailVerified) {
        finalInviteCodes = generateInviteCodesForUser(user.id);
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
        authenticators: authenticators.map((authenticator) =>
          toUserFacingAuthenticator({ authenticator })
        ),
        inviteCodes: finalInviteCodes.map((inviteCode) =>
          toUserFacingInviteCode({ inviteCode })
        ),
        files: files.map((file) => toUserFacingFile({ file })),
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
        with: {
          authenticators: {
            where: (authenticators, { isNull }) =>
              isNull(authenticators.deletedAt),
          },
        },
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
        with: {
          authenticators: {
            where: (authenticators, { isNull }) =>
              isNull(authenticators.deletedAt),
          },
        },
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
    .output(z.object({ authenticator: UserFacingAuthenticatorSchema }))
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
          .insert(schema.authenticator)
          .values({
            counter,
            credentialBackedUp,
            credentialDeviceType,
            credentialId,
            credentialPublicKey:
              Buffer.from(credentialPublicKey).toString("base64url"),
            name,
            transports: [].join(","),
            userId: user.id,
          })
          .returning(),
        db
          .update(schema.user)
          .set({ currentRegChallenge: null })
          .where(eq(schema.user.id, user.id)),
      ]);

      const authenticator: UserFacingAuthenticator = {
        addedAt: now.toUTCString(),
        credentialId,
        name,
      };

      return { authenticator };
    }),
  createAccount: authedProcedure
    .input(AccountCreationFormSchema)
    .mutation(async ({ input, ctx: { token } }) => {
      if (token.user.emailVerified === false) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not verified",
        });
      }

      const existingAccount = await db.query.account.findFirst({
        where: ({ handle, deletedAt }, { and, eq, isNull }) =>
          and(eq(handle, input.handle), isNull(deletedAt)),
      });

      if (existingAccount) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Handle already in use",
        });
      }

      await db.insert(schema.account).values({
        ...input,
        userId: token.user.id,
      });
    }),
  presign: authedProcedure
    .use(limiterMiddleware(uploadLimiter))
    .input(UploadClientPayloadSchema)
    .output(z.object({ url: z.string(), fileId: z.string() }))
    .mutation(async ({ input, ctx: { token } }) => {
      const user = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, token.user.id),
        with: {
          files: {
            where: (files, { and, isNotNull, isNull }) =>
              and(isNull(files.deletedAt), isNotNull(files.uploadedAt)),
          },
          accounts: {
            where: (accounts, { isNull }) => isNull(accounts.deletedAt),
          },
        },
      });

      if (!user) throw new Error("User not found");

      const totalSizeKB = getTotalFilesSizeKB(user.files);
      const totalSizeMB = totalSizeKB / 1024;

      if (user.storageLimitMB < totalSizeMB + input.fileDetails.sizeKB / 1024) {
        throw new Error("Storage limit exceeded");
      }

      const filesToDelete = user.files.filter(
        (f) => !f.uploadedAt && !f.deletedAt
      );

      await Promise.all([
        ...filesToDelete.map(async (f) => {
          const res = await s3.send(
            new DeleteObjectCommand({
              Bucket: getEnvAsStr("AWS_S3_BUCKET"),
              Key: `${f.key}`,
            })
          );
          console.log("deleted", res);
          await updateFile({
            id: f.id,
            fields: {
              deletedAt: DateTime.utc().toJSDate(),
            },
          });
        }),
      ]);

      const allowedContentTypes: string[] = [];
      let metadata: FileMetadata | null = null;

      switch (input.type) {
        case "avatar":
          allowedContentTypes.push("image/png", "image/jpeg", "image/gif");
          console.log("user", user);
          if (!user.accounts.find((a) => a.id === input.accountId)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Account not found",
            });
          }
          metadata = {
            type: "avatar",
            accountId: input.accountId,
          };
          break;
        case "post":
          break;
      }

      if (!allowedContentTypes.includes(input.fileDetails.type)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File type not allowed",
        });
      }

      const roundedSizeKB = Math.ceil(input.fileDetails.sizeKB);

      const extension = input.fileDetails.type.split("/")[1];

      const key = `${input.type}/${user.id}/${nanoid()}.${extension}`;

      const [file] = await db
        .insert(schema.file)
        .values({
          sizeKB: roundedSizeKB,
          key,
          userId: user.id,
          url: `https://cdn.mbsm.io/${key}`,
          metadata,
        })
        .returning();

      if (!file) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to insert file",
        });
      }

      const command = new PutObjectCommand({
        Bucket: getEnvAsStr("AWS_S3_BUCKET"),
        Key: key,
        ContentType: input.fileDetails.type,
        StorageClass: "INTELLIGENT_TIERING",
      });

      const url = await getSignedUrl(s3, command, {
        expiresIn: 20,
      });

      return { url, fileId: file.id };
    }),
  verifyUpload: authedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ input: { fileId }, ctx: { token } }) => {
      const user = await db.query.user.findFirst({
        where: ({ id }, { eq }) => eq(id, token.user.id),
        with: { files: true },
      });

      if (!user) throw new Error("User not found");

      const file = user.files.find((f) => f.id === fileId);

      if (!file) throw new Error("File not found");

      const command = new GetObjectCommand({
        Bucket: getEnvAsStr("AWS_S3_BUCKET"),
        Key: file.key,
      });

      try {
        await s3.send(command);
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify upload.",
        });
      }

      let promises: Promise<unknown>[] = [];

      switch (file.metadata?.type) {
        case "avatar":
          promises.push(
            updateAccount({
              id: file.metadata.accountId,
              fields: {
                avatarId: file.id,
              },
            })
          );
          break;
        default:
          throw new TRPCError({
            code: "METHOD_NOT_SUPPORTED",
            message: "Type not supported",
          });
      }

      await Promise.all([...promises]);

      await updateFile({
        id: fileId,
        fields: {
          uploadedAt: DateTime.utc().toISO(),
        },
      });
    }),
});
