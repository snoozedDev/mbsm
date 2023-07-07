import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable(
  "user",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    nanoId: varchar("nano_id", { length: 12 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    currentChallenge: varchar("current_challenge", { length: 256 }),
  },
  (table) => ({
    nanoIdIndex: uniqueIndex("nano_id_idx").on(table.nanoId),
    emailIndex: uniqueIndex("email_idx").on(table.email),
  })
);

export const userRelations = relations(user, ({ one, many }) => ({
  authenticators: many(authenticator),
}));

export const authenticator = mysqlTable("authenticator", {
  credentialId: varchar("credential_id", { length: 16 }).primaryKey(),
  credentialPublicKey: text("credential_public_key").notNull(),
  counter: bigint("counter", { mode: "bigint" }).notNull(),
  credentialDeviceType: varchar("credential_device_type", {
    length: 32,
  }).notNull(),
  credentialBackedUp: boolean("credential_backed_up").notNull(),
  transports: varchar("transports", { length: 256 }).notNull(),
  userId: bigint("user_id", { mode: "bigint" })
    .references(() => user.id)
    .notNull(),
});

export const authenticatorRelations = relations(
  authenticator,
  ({ one, many }) => ({
    user: one(user, {
      fields: [authenticator.userId],
      references: [user.id],
    }),
  })
);
