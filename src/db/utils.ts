import {
  AnyMySqlColumn,
  AnyMySqlColumnBuilder,
  index,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { snakeToCamel } from "../utils/stringUtils";

export const getTimestampColumns = (): Record<
  string,
  AnyMySqlColumnBuilder<{}>
> => ({
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const getIndexFor = (column: AnyMySqlColumn, unique?: boolean) => ({
  [snakeToCamel(column.name)]: (unique ? uniqueIndex : index)(
    `${column.name}_index`
  ).on(column),
});
