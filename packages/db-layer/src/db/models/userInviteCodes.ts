import { relations } from "drizzle-orm";
import { bigint, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";
import { getIndexFor } from "../utils";
import { user } from "./userModel";

export const inviteCode = mysqlTable(
  "invite_codes",
  {
    code: varchar("code", { length: 16 }).primaryKey(),
    userId: bigint("user_id", { mode: "bigint" })
      .references(() => user.id)
      .notNull(),
    redeemed: tinyint("redeemed").notNull().default(0),
  },
  (inviteCode) => ({
    ...getIndexFor(inviteCode.userId),
  })
);

export const inviteCodeRelations = relations(inviteCode, ({ one }) => ({
  user: one(user),
}));
