import { UserPreferences } from "@mbsm/types";
import { relations } from "drizzle-orm";
import { json, pgTable, uuid } from "drizzle-orm/pg-core";
import { getIndexFor } from "../utils";
import { user } from "./user";

export const userPreferences = pgTable(
  "user_preferences",
  {
    userId: uuid("user_id")
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

export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [userPreferences.userId],
      references: [user.id],
    }),
  })
);
