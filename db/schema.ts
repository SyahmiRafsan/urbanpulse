import pg from "pg";
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

const categoryEnum = pgEnum("category", ["lrt", "mrt", "mr", "bus"]);

// User table
const userTable = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  email: text("email").notNull(),
});

// Session table
const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// Recommendation table
const recommendationTable = pgTable("recommendation", {
  id: uuid("id").primaryKey(),
  description: text("description"),
  stopName: text("stop_name").notNull(),
  stopId: text("stop_id").notNull(), // You can also change to integer if necessary
  title: text("title").notNull(),
  upvotesCount: integer("upvotes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  category: categoryEnum("category").notNull(),
  highlights: text("highlights").array().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Media table
const mediaTable = pgTable("media", {
  id: uuid("id").primaryKey(),
  url: text("url").notNull(),
  recommendationId: uuid("recommendation_id")
    .notNull()
    .references(() => recommendationTable.id),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

// Stop table
const stopTable = pgTable("stop", {
  stopId: text("stop_id").primaryKey(), // Change to integer if necessary
  stopName: text("stop_name").notNull(),
  stopLat: integer("stop_lat").notNull(),
  stopLon: integer("stop_lon").notNull(),
  category: categoryEnum("category").notNull(),
  routeId: text("route_id"),
  geometry: text("geometry"),
  isOKU: boolean("is_oku"),
  status: text("status"),
  search: text("search"),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Export the database and tables for use in your application
export {
  categoryEnum,
  userTable,
  sessionTable,
  recommendationTable,
  mediaTable,
  stopTable,
};
