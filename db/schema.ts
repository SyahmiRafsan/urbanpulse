import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "LRT",
  "MRT",
  "MR",
  "BUS",
  "BRT",
]);

export const recommendationHighlightsEnum = pgEnum(
  "recommendation_highlights",
  [
    "ACCESSIBILITY",
    "CONNECTIVITY",
    "EFFICIENCY",
    "ENVIRONMENTAL",
    "QUALITY_OF_LIFE",
    "SAFETY",
  ]
);

export const mediaTypeEnum = pgEnum("media_type", [
  "RECOMMENDATION",
  "COMMENT",
]);

// User table
export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  email: text("email").notNull().unique(),
});

// Session table
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// Recommendation table
export const recommendationTable = pgTable("recommendation", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  stopId: uuid("stop_id")
    .notNull()
    .references(() => stopTable.id),

  upvotesCount: integer("upvotes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  category: categoryEnum("category").notNull(),
  highlights: recommendationHighlightsEnum("highlights").array().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// Comment table
export const commentTable = pgTable("comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  recommendationId: uuid("recommendation_id")
    .notNull()
    .references(() => stopTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// Media table
export const mediaTable = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  mediaId: uuid("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// Stop table
export const stopTable = pgTable("stop", {
  id: uuid("id").defaultRandom().primaryKey(),
  stopId: text("stop_id").unique(),
  stopName: text("stop_name").notNull(),
  stopLat: decimal("stop_lat", { precision: 10, scale: 6 }).notNull(),
  stopLon: decimal("stop_lon", { precision: 10, scale: 6 }).notNull(),
  category: categoryEnum("category").notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define the relationships for the user table
export const UserRelations = relations(userTable, ({ one, many }) => ({
  sessions: many(sessionTable),
  recommendations: many(recommendationTable),
  comments: many(commentTable),
  media: many(mediaTable),
}));

// Define the relationships for the session table
export const SessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

// Define the relationships for the recommendation table
export const RecommendationRelations = relations(
  recommendationTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [recommendationTable.userId],
      references: [userTable.id],
    }),
    stop: one(stopTable, {
      fields: [recommendationTable.stopId],
      references: [stopTable.id],
    }),
    comments: many(commentTable),
    media: many(mediaTable),
  })
);

// Define the relationships for the comment table
export const CommentRelations = relations(commentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [commentTable.userId],
    references: [userTable.id],
  }),
  recommendation: one(recommendationTable, {
    fields: [commentTable.recommendationId],
    references: [recommendationTable.id],
  }),
}));

// Define the relationships for the media table
export const MediaRelations = relations(mediaTable, ({ one }) => ({
  user: one(userTable, {
    fields: [mediaTable.userId],
    references: [userTable.id],
  }),
  recommendation: one(recommendationTable, {
    fields: [mediaTable.mediaId],
    references: [recommendationTable.id],
  }),
}));

// Define the relationships for the stop table
export const StopRelations = relations(stopTable, ({ many }) => ({
  recommendations: many(recommendationTable),
}));
