import { snakeToCamel } from "@mbsm/utils";
import { sql } from "drizzle-orm";
import {
  AnyPgColumn,
  index,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const CURRENT_TIMESTAMP = sql`CURRENT_TIMESTAMP`;

export const getTimestampColumns = () => ({
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at")
    .default(CURRENT_TIMESTAMP)
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(CURRENT_TIMESTAMP)
    .notNull()
    .defaultNow(),
});

export const getIndexFor = (column: AnyPgColumn, unique?: boolean) => ({
  [snakeToCamel(column.name)]: (unique ? uniqueIndex : index)(
    `${column.uniqueName}_index`
  ).on(column),
});
