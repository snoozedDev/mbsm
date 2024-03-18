import { userRoles } from "@mbsm/types";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { getIndexFor, getTimestampColumns } from "../utils";
import { account } from "./account";
import { authenticator } from "./authenticator";
import { file } from "./file";
import { inviteCode } from "./inviteCode";
import { userPreferences } from "./userPreferences";

export const roleEnum = pgEnum("role", userRoles);

export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 254 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    protected: boolean("protected").notNull().default(false),
    storageLimitMB: integer("storage_limit_MB").notNull().default(
      1024 // 1GB
    ),
    currentRegChallenge: varchar("current_challenge", { length: 256 }),
    role: roleEnum("role").notNull(),
    ...getTimestampColumns(),
  },
  (user) => ({
    ...getIndexFor(user.email, true),
  })
);

export const userRelations = relations(user, ({ one, many }) => ({
  authenticators: many(authenticator),
  inviteCodes: many(inviteCode),
  accounts: many(account),
  files: many(file),
  preferences: one(userPreferences, {
    fields: [user.id],
    references: [userPreferences.userId],
  }),
}));

export const userSchema = createSelectSchema(user);
