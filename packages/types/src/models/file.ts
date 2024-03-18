import { z } from "zod";

export const metadataTypes = ["avatar", "post"] as const;

export const FileMetadataTypeSchema = z.enum(metadataTypes);

export type FileMetadataType = (typeof metadataTypes)[number];

export const FileMetadataBaseSchema = z.object({
  type: FileMetadataTypeSchema,
});

export const AvatarFileMetadataSchema = FileMetadataBaseSchema.extend({
  type: z.literal("avatar"),
  accountId: z.string(),
});

export const PostFileMetadataSchema = FileMetadataBaseSchema.extend({
  type: z.literal("post"),
  postId: z.string(),
});

export const FileMetadataSchema = z.union([
  AvatarFileMetadataSchema,
  PostFileMetadataSchema,
]);

export type FileMetadata = z.infer<typeof FileMetadataSchema>;

export const isFileMetadata = (obj: unknown): obj is FileMetadata =>
  FileMetadataSchema.safeParse(obj).success;

export const UserFacingFileSchema = z.object({
  id: z.string(),
  url: z.string().nullable(),
  sizeKB: z.number(),
  createdAt: z.string(),
  metadata: z
    .object({
      type: FileMetadataTypeSchema,
    })
    .optional(),
});

FileMetadataSchema;

export type UserFacingFile = z.infer<typeof UserFacingFileSchema>;
