import { AccountProfileData } from "@mbsm/types";
import { relations } from "drizzle-orm";
import { json, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { file } from "./file";
import { user } from "./user";

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => user.id)
      .notNull(),
    handle: varchar("handle", { length: 16 }).notNull(),
    profileData: json("profile_data")
      .$type<AccountProfileData>()
      .notNull()
      .default({ links: [] }),
    avatarId: uuid("avatar_id").references(() => file.id),
    ...getTimestampColumns(),
  },
  (account) => ({
    ...getIndexFor(account.handle),
    ...getIndexFor(account.userId),
    ...getIndexFor(account.deletedAt),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
  avatar: one(file, {
    fields: [account.avatarId],
    references: [file.id],
  }),
}));
