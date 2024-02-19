import { relations } from "drizzle-orm";
import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { getIndexFor } from "../utils";
import { user } from "./user";

export const inviteCode = pgTable(
  "invite_codes",
  {
    code: varchar("code", { length: 16 }).primaryKey(),
    userId: uuid("user_id")
      .references(() => user.id)
      .notNull(),
    redeemed: boolean("redeemed").notNull().default(false),
  },
  (inviteCode) => ({
    ...getIndexFor(inviteCode.userId),
  })
);

export const inviteCodeRelations = relations(inviteCode, ({ one }) => ({
  user: one(user, {
    fields: [inviteCode.userId],
    references: [user.id],
  }),
}));
