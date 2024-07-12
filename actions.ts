"use server";

import { cookies } from "next/headers";
import { getStop } from "@/services/stop";
import { lucia } from "@/auth";
import { deleteFromR2, uploadToR2 } from "@/lib/r2";
import db from "./db/drizzle";
import {
  mediaTable,
  recommendationTable,
  recommendationUpvotesTable,
  stopTable,
  commentTable,
  userTable,
  mediaCommentTable,
} from "@/db/schema";
import { and, desc, eq, ExtractTablesWithRelations, sql } from "drizzle-orm";
import { cache } from "react";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import { getArrayDifferences } from "./lib/utils";

export const getUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return user;
});

export async function createRecommendation(
  formData: FormData
): Promise<Recommendation> {
  const rawFormData = Object.fromEntries(formData);
  // console.log(rawFormData);

  const stop = await getStop(String(rawFormData.stopId));

  const user = await getUser();

  if (user && stop) {
    const formObj = {
      id: rawFormData.id as string,
      title: rawFormData.title as string,
      description: rawFormData.description as string,
      stopId: String(stop.id),
      category: stop.category,
      userId: user.id,
      highlights: (rawFormData.highlights as string)
        .split(",")
        .map(
          (h) => h.toUpperCase().replaceAll(" ", "_") as RecommendationHighlight
        ),
    };

    const addedRecommendation = await db.transaction(async (tx) => {
      const [addRecTx] = await tx
        .insert(recommendationTable)
        .values([formObj])
        .returning();

      console.log({ addRecTx });

      const mediaFiles = await extractMediaFiles(formData, "media_");

      if (mediaFiles.length > 0) {
        const uploadedMediaWithRecommendationId = await uploadMedia(
          formData,
          rawFormData.id as string,
          user.id
        );

        console.log({ uploadedMediaWithRecommendationId });

        const addMediaTx = await tx
          .insert(mediaTable)
          .values(uploadedMediaWithRecommendationId)
          .returning();

        console.log({ addMediaTx });

        const recommendationWithMedia = {
          ...addRecTx,
          media: uploadedMediaWithRecommendationId,
        };

        // console.log({recommendationWithMedia})

        return recommendationWithMedia;
      } else {
        return { ...addRecTx, media: [] };
      }
    });
    return {
      ...addedRecommendation,
      stop: {
        id: stop.id || "",
        stopId: stop.stopId || "",
        stopName: stop.stop_name,
      },
    };
  } else throw Error("Unauthorised user");
}

export async function updateRecommendation(
  formData: FormData
  // oldMedia: Media[],
  // newMedia: Media[]
): Promise<Recommendation> {
  const rawFormData = Object.fromEntries(formData);
  // console.log(rawFormData);

  const recommendationId = rawFormData.id as string;
  const stop = await getStop(String(rawFormData.stopId));

  const user = await getUser();

  if (user) {
    const formObj = {
      title: rawFormData.title as string,
      description: rawFormData.description as string,
      stopId: String(stop.id),
      category: stop.category,
      userId: user.id,
      highlights: (rawFormData.highlights as string)
        .split(",")
        .map(
          (h) => h.toUpperCase().replaceAll(" ", "_") as RecommendationHighlight
        ),
    };

    const mediaDeleted = JSON.parse(rawFormData.mediaDeleted as string);
    const mediaAdded = JSON.parse(rawFormData.mediaAdded as string);
    const newMedia = await extractMediaFiles(formData, "media_");
    const oldMedia = await extractMediaFiles(formData, "old_media_");

    // const mediaUpdated = !arraysEqualUploadFile(oldMedia, newMedia);

    const updatedRecommendation: Recommendation = await db.transaction(
      async (tx: MyTransaction) => {
        const txUpdated = await tx
          .update(recommendationTable)
          .set(formObj)
          .where(
            and(
              eq(recommendationTable.id, recommendationId),
              eq(recommendationTable.userId, user.id)
            )
          )
          .returning();

        console.log({ oldMedia, newMedia });

        console.log({
          mediaAdded: mediaAdded.length,
          mediaDeleted: mediaDeleted.length,
        });

        console.log({
          mediaAdded: mediaAdded,
          mediaDeleted: mediaDeleted,
        });

        if (mediaDeleted) {
          const deletedUrls = await deleteMediaTableWithR2(
            tx,
            mediaDeleted.map((del: Media) => {
              return {
                id: del.id,
                url: del.url as string,
              };
            }),
            recommendationId,
            user.id
          );

          console.log({ deletedUrls });
        }

        if (mediaAdded.length > 0) {
          const appendedNewMedia = getArrayDifferences(
            oldMedia,
            newMedia
          ).added;

          console.log({ appendedNewMedia });

          const uploadedMedia = await uploadToR2(
            appendedNewMedia as unknown as UploadedFile[]
          );

          const addMediaTx = await tx
            .insert(mediaTable)
            .values(
              uploadedMedia.map((media) => {
                return {
                  ...media,
                  recommendationId: recommendationId,
                  userId: user.id,
                };
              })
            )
            .returning();

          return {
            ...txUpdated,
            stop: {
              id: stop.id || "",
              stopId: stop.stopId || "",
              stopName: stop.stop_name,
            },
          } as unknown as Recommendation;
        }

        return {
          ...txUpdated,
          stop: {
            id: stop.id || "",
            stopId: stop.stopId || "",
            stopName: stop.stop_name,
          },
        } as unknown as Recommendation;
      }
    );
    return updatedRecommendation;
  } else throw Error("Unauthorised user");
}

export async function deleteRecommendation(recommendation: Recommendation) {
  const user = await getUser();

  if (user) {
    const deletedRecommendation = await db.transaction(
      async (tx: MyTransaction) => {
        const [txDeletedRec] = await tx
          .delete(recommendationTable)
          .where(
            and(
              eq(recommendationTable.id, recommendation.id),
              eq(recommendationTable.userId, user.id)
            )
          )
          .returning();

        // Use the refactored deleteMediaTableWithR2 function within the transaction
        if (recommendation.media) {
          const media = await deleteMediaTableWithR2(
            tx,
            recommendation.media.map((med) => {
              return {
                id: med.id,
                url: med.url,
              };
            }),
            recommendation.id,
            user.id
          );
        }

        return txDeletedRec;
      }
    );

    return deletedRecommendation;
  } else {
    throw new Error("Unauthorized user");
  }
}

export async function upvoteRecommendation(
  recommendationId: string
): Promise<void> {
  const user = await getUser();

  if (user) {
    const upvote = await db.transaction(async (tx) => {
      // Insert into the recommendationUpvotesTable
      const [upvotedUser] = await tx
        .insert(schema.recommendationUpvotesTable)
        .values({
          userId: user.id,
          recommendationId,
          upvotedAt: new Date(),
        });

      // Increment the upvotesCount in the recommendationTable
      await tx
        .update(recommendationTable)
        .set({ upvotesCount: sql.raw(`upvotes_count + 1`) })
        .where(eq(recommendationTable.id, recommendationId));

      return upvotedUser;
    });
    return upvote;
  }
}

export async function removeUpvoteRecommendation(recommendationId: string) {
  const user = await getUser();

  if (user) {
    const removed = await db.transaction(async (tx) => {
      // Delete from the recommendationUpvotesTable
      const [removedVoteUser] = await tx
        .delete(recommendationUpvotesTable)
        .where(
          and(
            eq(recommendationUpvotesTable.userId, user.id),
            eq(recommendationUpvotesTable.recommendationId, recommendationId)
          )
        );

      // Decrement the upvotesCount in the recommendationTable
      await tx
        .update(recommendationTable)
        .set({ upvotesCount: sql.raw(`upvotes_count - 1`) })
        .where(eq(recommendationTable.id, recommendationId));

      return removedVoteUser;
    });
    return removed;
  }
}

export async function fetchRecommendationsWithUpvoteStatus(
  options: FetchRecommendationsOptions
) {
  const { userId, sortType, userLat, userLon } = options;

  // Base query setup
  let baseQuery = db
    .select({
      id: recommendationTable.id,
      title: recommendationTable.title,
      description: recommendationTable.description,
      stopId: recommendationTable.stopId,
      upvotesCount: recommendationTable.upvotesCount,
      commentsCount: recommendationTable.commentsCount,
      category: recommendationTable.category,
      highlights: recommendationTable.highlights,
      createdAt: recommendationTable.createdAt,
      updatedAt: recommendationTable.updatedAt,
      userId: recommendationTable.userId,
      // Conditionally add userUpvoted field if userId is provided
      userUpvoted: userId
        ? sql<boolean>`
            EXISTS (
              SELECT 1
              FROM ${recommendationUpvotesTable}
              WHERE ${recommendationUpvotesTable.recommendationId} = ${recommendationTable.id}
                AND ${recommendationUpvotesTable.userId} = ${userId}
            )
          `
        : sql<null>`NULL`,
      stop: {
        id: stopTable.id,
        stopId: stopTable.stopId,
        stopName: stopTable.stopName,
        stopLat: stopTable.stopLat,
        stopLon: stopTable.stopLon,
        category: stopTable.category,
        updatedAt: stopTable.updatedAt,
      },
      media: {
        id: mediaTable.id,
        url: mediaTable.url,
        userId: mediaTable.userId,
        createdAt: mediaTable.createdAt,
        mediaId: mediaTable.recommendationId,

        mimeType: mediaTable.mimeType,
      },
    })
    .from(recommendationTable)
    .leftJoin(stopTable, eq(stopTable.id, recommendationTable.stopId))
    .leftJoin(
      mediaTable,
      eq(mediaTable.recommendationId, recommendationTable.id)
    ); // Join the media table

  let userQuery;
  // Conditionally add the recommendationUpvotesTable join and groupBy if userId is provided
  if (userId) {
    userQuery = baseQuery
      .leftJoin(
        recommendationUpvotesTable,
        eq(recommendationUpvotesTable.recommendationId, recommendationTable.id)
      )
      .groupBy(
        recommendationTable.id,
        stopTable.id, // Add stopTable.id to group by clause
        stopTable.stopId,
        stopTable.stopName,
        stopTable.stopLat,
        stopTable.stopLon,
        stopTable.category,
        stopTable.updatedAt,
        recommendationTable.userId,
        mediaTable.id, // Group by media table fields
        mediaTable.url
      );
  } else {
    userQuery = baseQuery.groupBy(
      recommendationTable.id,
      stopTable.id, // Add stopTable.id to group by clause
      stopTable.stopId,
      stopTable.stopName,
      stopTable.stopLat,
      stopTable.stopLon,
      stopTable.category,
      stopTable.updatedAt,
      mediaTable.id, // Group by media table fields
      mediaTable.url
    );
  }

  // Apply sorting based on the sortType
  let sortedQuery;
  switch (sortType) {
    case "nearby":
      if (userLat === undefined || userLon === undefined) {
        throw new Error(
          "userLat and userLon must be provided for nearby sorting"
        );
      }
      sortedQuery = userQuery.orderBy(
        sql`
        6371 * 2 * ASIN(
          SQRT(
            POWER(
              SIN(
                RADIANS(${stopTable.stopLat} - ${userLat}) / 2
              ), 2
            ) +
            COS(RADIANS(${userLat})) * COS(RADIANS(${stopTable.stopLat})) *
            POWER(
              SIN(
                RADIANS(${stopTable.stopLon} - ${userLon}) / 2
              ), 2
            )
          )
        )
      `,
        desc(recommendationTable.upvotesCount),
        desc(recommendationTable.createdAt)
      );
      break;

    case "latest":
      sortedQuery = userQuery.orderBy(
        desc(recommendationTable.createdAt),
        desc(recommendationTable.upvotesCount)
      );
      break;

    case "most_upvoted":
      sortedQuery = userQuery.orderBy(
        desc(recommendationTable.upvotesCount),
        desc(recommendationTable.createdAt)
      );
      break;

    default:
      throw new Error("Invalid sortType");
  }

  const recommendations = await sortedQuery.execute();

  // Map the results to include stop information under the 'stop' key and media as an array
  return recommendations.reduce(
    (acc, rec) => {
      // Find or create the recommendation entry
      let recommendation = acc.find((r) => r.id === rec.id);

      if (
        !recommendation &&
        rec.stop &&
        rec.stop.stopId &&
        rec.stop.updatedAt
      ) {
        recommendation = {
          id: rec.id,
          title: rec.title,
          description: rec.description,
          stopId: rec.stopId,
          upvotesCount: rec.upvotesCount,
          commentsCount: rec.commentsCount,
          category: rec.category,
          highlights: rec.highlights,
          createdAt: rec.createdAt,
          updatedAt: rec.updatedAt,
          userId: rec.userId,
          userUpvoted: rec.userUpvoted,
          stop: {
            id: rec.stop.id,
            stopId: rec.stop.stopId,
            stopName: rec.stop.stopName,
            stopLat: rec.stop.stopLat,
            stopLon: rec.stop.stopLon,
            category: rec.stop.category,
            updatedAt: rec.stop.updatedAt,
          },
          media: [], // Initialize media as an empty array
        };
        acc.push(recommendation);
      }

      // Add media to the recommendation's media array
      if (recommendation && rec.media && rec.media.id) {
        recommendation.media.push({
          id: rec.media.id,
          url: rec.media.url,
          userId: rec.media.userId,
          createdAt: rec.media.createdAt,
          mediaId: rec.media.mediaId,
          mimeType: rec.media.mimeType,
        });
      }

      return acc;
    },
    [] as Array<{
      id: string;
      title: string;
      description: string;
      stopId: string;
      upvotesCount: number;
      commentsCount: number;
      category: string;
      highlights: string[];
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      userUpvoted: boolean | null;
      media: {
        id: string;
        userId: string;
        createdAt: Date;
        url: string;
        mediaId: string;
        file?: File;

        mimeType: string;
      }[];
      stop: {
        id: string;
        stopId: string;
        stopName: string;
        stopLat: string;
        stopLon: string;
        category: string;
        updatedAt: Date;
      };
    }>
  );
}

export async function createComment(
  formData: FormData
): Promise<RecommendationComment> {
  const rawFormData = Object.fromEntries(formData);
  // console.log(rawFormData);

  const stop = await getStop(String(rawFormData.stopId));

  const user = await getUser();

  if (user && stop) {
    const formObj = {
      id: rawFormData.id as string,
      content: rawFormData.content as string,
      userId: user.id,
      recommendationId: rawFormData.recommendationId as string,
    };

    const addComment = await db.transaction(async (tx) => {
      const [addCommentTx] = await tx
        .insert(commentTable)
        .values([formObj])
        .returning();

      console.log({ addCommentTx });

      const mediaFiles = await extractMediaFiles(formData, "media_");

      if (mediaFiles.length > 0) {
        const uploadedMediaWithCommentId = await uploadMediaComment(
          formData,
          rawFormData.id as string,
          user.id
        );

        console.log({ uploadedMediaWithCommentId });

        const addMediaTx = await tx
          .insert(mediaCommentTable)
          .values(uploadedMediaWithCommentId)
          .returning();

        console.log({ addMediaTx });

        const recommendationWithMedia = {
          ...addCommentTx,
          media: uploadedMediaWithCommentId,
        };

        // console.log({recommendationWithMedia})

        return recommendationWithMedia;
      } else {
        return { ...addCommentTx, media: [] };
      }
    });
    return addComment;
  } else throw Error("Unauthorised user");
}

export async function deleteComment(comment: RecommendationComment) {
  const user = await getUser();

  if (user) {
    const deletedComment = await db.transaction(
      async (tx: MyTransaction) => {
        const [txDeletedComment] = await tx
          .delete(commentTable)
          .where(
            and(
              eq(commentTable.id, comment.id),
              eq(commentTable.userId, user.id)
            )
          )
          .returning();

        // Use the refactored deleteMediaTableWithR2 function within the transaction
        if (comment.media) {
        const media=  await deleteMediaCommentTableWithR2(
            tx,
            comment.media.map((med) => {
              return {
                id: med.id,
                url: med.url,
              };
            }),
            comment.id,
            user.id
          );
        }

        return txDeletedComment;
      }
    );

    return deletedComment;
  } else {
    throw new Error("Unauthorized user");
  }
}

export async function updateUserInfo(name: string) {
  const user = await getUser();

  if (user) {
    const updatedUser = await db
      .update(userTable)
      .set({ name: name })
      .where(eq(userTable.id, user.id));

    return updatedUser;
  } else {
    throw Error("User is not logged in");
  }
}

// Custom Drizzle transaction type
type MyTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

async function deleteMediaTableWithR2(
  tx: MyTransaction,
  mediaArray: { id: string; url: string }[],
  recommendationId: string,
  userId: string
) {
  const deletedUrls = await deleteFromR2(mediaArray);

  const deleteTxs = mediaArray.map(async (media) => {
    await tx
      .delete(mediaTable)
      .where(
        and(
          eq(mediaTable.recommendationId, recommendationId),
          eq(mediaTable.id, media.id),
          eq(mediaTable.userId, userId)
        )
      );
  });

  const urls = await Promise.all(deleteTxs);

  return deletedUrls;
}

async function deleteMediaCommentTableWithR2(
  tx: MyTransaction,
  mediaArray: { id: string; url: string }[],
  commentId: string,
  userId: string
) {
  const deletedUrls = await deleteFromR2(mediaArray);

  const deleteTxs = mediaArray.map(async (media) => {
    await tx
      .delete(mediaCommentTable)
      .where(
        and(
          eq(mediaCommentTable.commentId, commentId),
          eq(mediaCommentTable.id, media.id),
          eq(mediaCommentTable.userId, userId)
        )
      );
  });

  const urls = await Promise.all(deleteTxs);

  return deletedUrls;
}

async function uploadMedia(
  formData: FormData,
  recommendationId: string,
  userId: string
) {
  const mediaFiles = await extractMediaFiles(formData, "media_");

  // Upload media files to R2
  const uploadedMedia = await uploadToR2(mediaFiles);

  // console.log({ uploadedMedia });

  const uploadedMediaWithRecommendationId: Media[] = uploadedMedia.map(
    (media) => {
      return {
        ...media,
        recommendationId,
        userId,
      };
    }
  );

  return uploadedMediaWithRecommendationId;
}

async function uploadMediaComment(
  formData: FormData,
  commentId: string,
  userId: string
) {
  const mediaFiles = await extractMediaFiles(formData, "media_");

  // Upload media files to R2
  const uploadedMedia = await uploadToR2(mediaFiles);

  // console.log({ uploadedMedia });

  const uploadedMediaWithCommentId: MediaComment[] = uploadedMedia.map(
    (media) => {
      return {
        ...media,
        commentId,
        userId,
      };
    }
  );

  return uploadedMediaWithCommentId;
}

async function extractMediaFiles(formData: FormData, splitter: string) {
  const mediaFiles: UploadedFile[] = [];

  const mediaEntries = Array.from(formData.entries());
  for (const [key, value] of mediaEntries) {
    if (key.startsWith(splitter) && value instanceof File) {
      mediaFiles.push({
        id: key.replace(splitter, ""),
        key: value.name,
        buffer: Buffer.from(await value.arrayBuffer()), // Convert File to Buffer
        originalname: value.name,
        mimetype: value.type,
        url: `https://${process.env.R2_DOMAIN}/${value.name}`,
      });
    }
  }

  return mediaFiles;
}
