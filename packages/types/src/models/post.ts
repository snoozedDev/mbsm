import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";
import { ImageSchema } from "./image";

// SCHEMAS

export const PostPrimitiveSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
  tags: z.string().array().nonempty().optional(),
  postedAt: z.string(),
});

export const ImagePostSchema = PostPrimitiveSchema.extend({
  type: z.literal("image"),
  images: z.array(ImageSchema).nonempty(),
});

export const TextPostSchema = PostPrimitiveSchema.extend({
  type: z.literal("text"),
});

export const PostSchema = z.union([ImagePostSchema, TextPostSchema]);

// TYPES
export type ImagePost = z.infer<typeof ImagePostSchema>;
export type TextPost = z.infer<typeof TextPostSchema>;
export type Post = z.infer<typeof PostSchema>;

// TYPE GUARDS
export const isImagePost = getZodTypeGuard(ImagePostSchema);
export const isTextPost = getZodTypeGuard(TextPostSchema);
export const isPost = getZodTypeGuard(PostSchema);
