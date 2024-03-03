import { ImageHotspot } from "@mbsm/types";
import { integer, json, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { getIndexFor, getTimestampColumns } from "../utils";
import { user } from "./user";

export const image = pgTable(
  "image",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => user.id)
      .notNull(),
    url: varchar("url", { length: 256 }).notNull(),
    hotspot: json("hotspot").$type<ImageHotspot>(),
    height: integer("height").notNull(),
    width: integer("width").notNull(),
    ...getTimestampColumns(),
  },
  (image) => ({
    ...getIndexFor(image.userId),
  })
);
