import { relations } from "drizzle-orm";
import { pgTable, primaryKey, serial } from "drizzle-orm/pg-core";
import { account } from "./account";

export const follower = pgTable(
  "follower",
  {
    followerId: serial("follower_id")
      .references(() => account.id)
      .notNull(),
    followeeId: serial("followee_id")
      .references(() => account.id)
      .notNull(),
  },
  ({ followeeId, followerId }) => ({
    pk: primaryKey({ columns: [followeeId, followerId] }),
  })
);

export const followerRelations = relations(follower, ({ one }) => ({
  follower: one(account, {
    fields: [follower.followerId],
    references: [account.id],
  }),
  followee: one(account, {
    fields: [follower.followeeId],
    references: [account.id],
  }),
}));
