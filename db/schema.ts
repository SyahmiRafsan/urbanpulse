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
  primaryKey,
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
  emailHash: text("email_hash").notNull().unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
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
    .references(() => recommendationTable.id, { onDelete: "cascade" }),
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
  recommendationId: uuid("recommendation_id")
    .notNull()
    .references(() => recommendationTable.id, {
      onDelete: "cascade",
    }),
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

// Media Comment Table
export const mediaCommentTable = pgTable("media_comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => commentTable.id, { onDelete: "cascade" }), // Specific to comments
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

// RecommendationUpvotes table
export const recommendationUpvotesTable = pgTable(
  "recommendation_upvotes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    recommendationId: uuid("recommendation_id")
      .notNull()
      .references(() => recommendationTable.id, { onDelete: "cascade" }),
    upvotedAt: timestamp("upvoted_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.recommendationId] }),
    };
  }
);

// Define the relationships for the user table
export const UserRelations = relations(userTable, ({ one, many }) => ({
  sessions: many(sessionTable),
  recommendations: many(recommendationTable),
  comments: many(commentTable),
  media: many(mediaTable),
  upvotes: many(recommendationTable),
}));

// Define the relationships for the session table
export const SessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

// Define the relationships for the recommendation upvotes table
export const RecommendationUpvotesTableRelations = relations(
  recommendationUpvotesTable,
  ({ one, many }) => ({
    recommendation: one(recommendationTable, {
      fields: [recommendationUpvotesTable.recommendationId],
      references: [recommendationTable.id],
    }),
  })
);

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
    upvotes: many(recommendationUpvotesTable),
  })
);

// Define the relationships for the comment table
export const CommentRelations = relations(commentTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [commentTable.userId],
    references: [userTable.id],
  }),
  recommendation: one(recommendationTable, {
    fields: [commentTable.recommendationId],
    references: [recommendationTable.id],
  }),
  media: many(mediaCommentTable),
}));

// Define the relationships for the media table
export const MediaRelations = relations(mediaTable, ({ one }) => ({
  user: one(userTable, {
    fields: [mediaTable.userId],
    references: [userTable.id],
  }),
  recommendation: one(recommendationTable, {
    fields: [mediaTable.recommendationId],
    references: [recommendationTable.id],
  }),
}));

export const MediaCommentRelations = relations(
  mediaCommentTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [mediaCommentTable.userId],
      references: [userTable.id],
    }),
    comment: one(commentTable, {
      fields: [mediaCommentTable.commentId],
      references: [commentTable.id],
    }),
  })
);

// Define the relationships for the stop table
export const StopRelations = relations(stopTable, ({ many }) => ({
  recommendations: many(recommendationTable),
}));
