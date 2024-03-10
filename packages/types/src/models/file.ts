import { z } from "zod";

export const AvatarFileMetadataSchema = z.object({
  type: z.literal("avatar"),
  accountId: z.string(),
});

export const PostFileMetadataSchema = z.object({
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

export const FileSchema = z.object({
  id: z.string(),
  metadata: FileMetadataSchema.nullable(),
  url: z.string().nullable(),
  sizeKB: z.number(),
  createdAt: z.string(),
});
