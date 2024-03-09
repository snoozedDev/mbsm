import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

export const HotspotSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
});

export const ImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  hotspot: HotspotSchema.nullable(),
  height: z.number().min(1).nullable(),
  width: z.number().min(1).nullable(),
});

export type ImageHotspot = z.infer<typeof HotspotSchema>;
export type Image = z.infer<typeof ImageSchema>;

export const isImage = getZodTypeGuard(ImageSchema);
