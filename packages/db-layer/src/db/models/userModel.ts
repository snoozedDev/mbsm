import { relations } from "drizzle-orm";
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { authenticator } from "./authenticatorModel";

export const user = mysqlTable(
  "user",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    nanoId: varchar("nano_id", { length: 12 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    emailVerified: tinyint("email_verified").notNull().default(0),
    protected: tinyint("protected").notNull().default(0),
    currentRegChallenge: varchar("current_challenge", { length: 256 }),
    role: mysqlEnum("role", ["user", "mod", "admin", "foru"])
      .notNull()
      .default("user"),
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
