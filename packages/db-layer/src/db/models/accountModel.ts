import { relations } from "drizzle-orm";
import { bigint, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { user } from "./userModel";

export const account = mysqlTable(
  "account",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "bigint" })
      .references(() => user.id)
      .notNull(),
    handle: varchar("handle", { length: 16 }).notNull(),
    ...getTimestampColumns(),
  },
  (account) => ({
    ...getIndexFor(account.handle, true),
    ...getIndexFor(account.userId),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user),
}));
