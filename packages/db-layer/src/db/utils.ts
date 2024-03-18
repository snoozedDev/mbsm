import { snakeToCamel } from "@mbsm/utils";
import {
  AnyPgColumn,
  index,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const getTimestampColumns = () => ({
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const getIndexFor = (column: AnyPgColumn, unique?: boolean) => ({
  [snakeToCamel(column.name)]: (unique ? uniqueIndex : index)(
    `${column.uniqueName}_index`
  ).on(column),
});
