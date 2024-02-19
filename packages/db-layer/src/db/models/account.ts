import { relations } from "drizzle-orm";
import { pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { user } from "./user";

export const account = pgTable(
  "account",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
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
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
