import { FileMetadata } from "@mbsm/types";
import { relations } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { user } from "./user";

export const file = pgTable(
  "file",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => user.id)
      .notNull(),
    key: varchar("key", { length: 256 }).notNull(),
    url: varchar("url", { length: 256 }),
    sizeKB: integer("size_kb").notNull(),
    uploadedAt: timestamp("uploaded_at", { mode: "string" }),
    metadata: json("metadata").$type<FileMetadata>(),
    ...getTimestampColumns(),
  },
  (file) => ({
    ...getIndexFor(file.userId),
  })
);

export const fileRelations = relations(file, ({ one }) => ({
  user: one(user, {
    fields: [file.userId],
    references: [user.id],
  }),
}));
