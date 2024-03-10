import { getZodTypeGuard } from "@mbsm/types";
import { z } from "zod";

const uploadTypes = ["avatar", "post"] as const;

const UploadTypeSchema = z.enum(uploadTypes);

const FileSchema = z.object({
  sizeKB: z.number(),
});

const UploadClientPayloadBaseSchema = z.object({
  type: UploadTypeSchema,
  fileDetails: FileSchema,
});

const AvatarUploadClientPayloadSchema = UploadClientPayloadBaseSchema.extend({
  type: z.literal("avatar"),
  accountId: z.string(),
});

const PostUploadClientPayloadSchema = UploadClientPayloadBaseSchema.extend({
  type: z.literal("post"),
});

export const UploadClientPayloadSchema = z.union([
  AvatarUploadClientPayloadSchema,
  PostUploadClientPayloadSchema,
]);

export const isUploadClientPayload = getZodTypeGuard(UploadClientPayloadSchema);

export type UploadClientPayload = z.infer<typeof UploadClientPayloadSchema>;

export const UploadTokenPayloadSchema = z.object({
  clientPayload: UploadClientPayloadSchema,
  fileId: z.string(),
});

export const isUploadTokenPayload = getZodTypeGuard(UploadTokenPayloadSchema);

export type UploadTokenPayload = z.infer<typeof UploadTokenPayloadSchema>;
