import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { user } from "./user";

export const authenticator = pgTable(
  "authenticator",
  {
    id: serial("id").primaryKey(),
    credentialId: varchar("credential_id", { length: 256 }).notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: varchar("credential_device_type", {
      length: 32,
    }).notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: varchar("transports", { length: 256 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    userId: integer("user_id")
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
