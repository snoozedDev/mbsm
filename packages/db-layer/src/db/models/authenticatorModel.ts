import { relations } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  text,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { user } from "./userModel";

export const authenticator = mysqlTable(
  "authenticator",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    credentialId: varchar("credential_id", { length: 64 }).notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: bigint("counter", { mode: "bigint" }).notNull(),
    credentialDeviceType: varchar("credential_device_type", {
      length: 32,
    }).notNull(),
    credentialBackedUp: tinyint("credential_backed_up").notNull(),
    transports: varchar("transports", { length: 256 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    userId: bigint("user_id", { mode: "bigint" })
      .references(() => user.id)
      .notNull(),
    ...getTimestampColumns(),
  },
  (authenticator) => ({
    ...getIndexFor(authenticator.credentialId, true),
    ...getIndexFor(authenticator.userId),
  })
);

export const authenticatorRelations = relations(authenticator, ({ one }) => ({
  user: one(user, {
    fields: [authenticator.userId],
    references: [user.id],
  }),
}));
