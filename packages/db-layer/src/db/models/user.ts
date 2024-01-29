import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { authenticator } from "./authenticator";

export const roleEnum = pgEnum("role", ["user", "mod", "admin", "foru"]);

export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    nanoId: varchar("nano_id", { length: 12 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    protected: boolean("protected").notNull().default(false),
    currentRegChallenge: varchar("current_challenge", { length: 256 }),
    role: roleEnum("user").notNull(),
    ...getTimestampColumns(),
  },
  (user) => ({
    ...getIndexFor(user.nanoId, true),
    ...getIndexFor(user.email, true),
  })
);

export const userRelations = relations(user, ({ one, many }) => ({
  authenticators: many(authenticator),
}));
