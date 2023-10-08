import { UserPreferences } from "@mbsm/types";
import { relations } from "drizzle-orm";
import { bigint, json, mysqlTable } from "drizzle-orm/mysql-core";
import { getIndexFor } from "../utils";
import { user } from "./userModel";

export const userPreferences = mysqlTable(
  "user_preferences",
  {
    userId: bigint("user_id", { mode: "bigint" })
      .references(() => user.id)
      .primaryKey(),
    data: json("data")
      .$type<UserPreferences>()
      .default({ theme: "system", nsfw: "hidden" }),
  },
  (userPreferences) => ({
    ...getIndexFor(userPreferences.userId, true),
  })
);

export const userPreferencesRelations = relations(user, ({ one }) => ({
  user: one(user),
}));
