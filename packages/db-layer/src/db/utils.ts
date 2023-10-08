import {
  AnyMySqlColumn,
  index,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { snakeToCamel } from "@mbsm/utils";

export const getTimestampColumns = () => ({
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const getIndexFor = (column: AnyMySqlColumn, unique?: boolean) => ({
  [snakeToCamel(column.name)]: (unique ? uniqueIndex : index)(
    `${column.name}_index`
  ).on(column),
});
