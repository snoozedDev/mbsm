import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { UserRole } from "./schemaUtils";

export const getUserCodes = query({
  args: {},
  handler: async (cts, arg) => {
    const auth = await cts.auth.getUserIdentity();
    console.log({ auth });
    return "Hello, Worsdfld!";
  },
});

export type UserFacingUser = {
  email?: string;
  emailVerified: boolean;
  role: UserRole;
};

const userToUserFacing = (user: Doc<"users">): UserFacingUser => ({
  email: user.email,
  emailVerified: user.emailVerified,
  role: user.role,
});

export const store = mutation({
  args: {},
  handler: async (ctx): Promise<UserFacingUser> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("token", identity.tokenIdentifier))
      .unique();

    if (user) {
      return userToUserFacing(user);
    }
    // If  it's a new identity, create a new `User`
    await ctx.db.insert("users", {
      email: identity.email,
      emailVerified: identity.emailVerified ?? false,
      role: UserRole.User,
      token: identity.tokenIdentifier,
    });
    return {
      email: identity.email,
      emailVerified: identity.emailVerified ?? false,
      role: UserRole.User,
    };
  },
});
