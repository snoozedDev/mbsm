import { InferSelectModel } from "drizzle-orm";
import { schema } from "./schemaModels";

type IsTable<T> = {
  [K in keyof T]: T[K] extends { getSQL: (arg: any) => any } ? K : never;
}[keyof T];

export type TableKeys = IsTable<typeof schema>;

export type DbSchema<T extends TableKeys> = InferSelectModel<
  (typeof schema)[T]
>;
