import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    token: v.string(),
    email: v.optional(v.string()),
    emailVerified: v.boolean(),
    role: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"]),
  inviteCodes: defineTable({
    user: v.id("users"),
    code: v.string(),
    redeemed: v.boolean(),
  })
    .index("by_code", ["code"])
    .index("by_user", ["user"]),
  images: defineTable({
    url: v.string(),
  }),
});
