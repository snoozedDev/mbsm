import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

// SCHEMAS

export const ImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  hotspot: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
      height: z.number().min(0).max(1),
      width: z.number().min(0).max(1),
    })
    .optional(),
  height: z.number().min(1),
  width: z.number().min(1),
});

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
export type Image = z.infer<typeof ImageSchema>;
export type ImagePost = z.infer<typeof ImagePostSchema>;
export type TextPost = z.infer<typeof TextPostSchema>;
export type Post = z.infer<typeof PostSchema>;

// TYPE GUARDS
export const isImage = getZodTypeGuard(ImageSchema);
export const isImagePost = getZodTypeGuard(ImagePostSchema);
export const isTextPost = getZodTypeGuard(TextPostSchema);
export const isPost = getZodTypeGuard(PostSchema);
