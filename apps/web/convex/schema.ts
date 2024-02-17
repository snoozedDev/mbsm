import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    displayName: v.string(),
    username: v.string(),
    avatar: v.id("images"),

    bio: v.optional(v.string()),
    bioLinks: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
        })
      )
    ),
    nsfw: v.optional(v.boolean()),
    joinedAt: v.string(),
  }),
  images: defineTable({
    url: v.string(),
  }),
});
