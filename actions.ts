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
          user.id,
          "RECOMMENDATION"
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
                  mediaId: recommendationId,
                  userId: user.id,
                  mediaType: "RECOMMENDATION" as MediaType,
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
        const txDeletedRec = tx
          .delete(recommendationTable)
          .where(
            and(
              eq(recommendationTable.id, recommendation.id),
              eq(recommendationTable.userId, user.id)
            )
          )
          .returning();

        // Use the refactored deleteMediaTableWithR2 function within the transaction
        await deleteMediaTableWithR2(
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
        return txDeletedRec;
      }
    );

    return deletedRecommendation;
  } else {
    throw new Error("Unauthorized user");
  }
}

export async function upvoteRecommendation(
  userId: string,
  recommendationId: string
): Promise<void> {
  const upvote = await db.transaction(async (tx) => {
    // Insert into the recommendationUpvotesTable
    const [upvotedUser] = await tx
      .insert(schema.recommendationUpvotesTable)
      .values({
        userId,
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
        mediaId: mediaTable.mediaId,
        mediaType: mediaTable.mediaType,
        mimeType: mediaTable.mimeType,
      },
    })
    .from(recommendationTable)
    .leftJoin(stopTable, eq(stopTable.id, recommendationTable.stopId))
    .leftJoin(mediaTable, eq(mediaTable.mediaId, recommendationTable.id)); // Join the media table

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
        mediaTable.url,
        mediaTable.mediaType
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
      mediaTable.url,
      mediaTable.mediaType
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
      `
      );
      break;

    case "latest":
      sortedQuery = userQuery.orderBy(desc(recommendationTable.createdAt));
      break;

    case "most_upvoted":
      sortedQuery = userQuery.orderBy(desc(recommendationTable.upvotesCount));
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
          mediaType: rec.media.mediaType,
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
        mediaType: MediaType;
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

// Custom Drizzle transaction type
type MyTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

async function deleteMediaTableWithR2(
  tx: MyTransaction,
  mediaArray: { id: string; url: string }[],
  mediaId: string,
  userId: string
) {
  const deletedUrls = await deleteFromR2(mediaArray);

  const deleteTxs = mediaArray.map(async (media) => {
    await tx
      .delete(mediaTable)
      .where(
        and(
          eq(mediaTable.mediaId, mediaId),
          eq(mediaTable.id, media.id),
          eq(mediaTable.userId, userId)
        )
      );
  });

  const urls = await Promise.all(deleteTxs);

  return deletedUrls;
}

async function uploadMedia(
  formData: FormData,
  mediaId: string,
  userId: string,
  mediaType: MediaType
) {
  const mediaFiles = await extractMediaFiles(formData, "media_");

  // Upload media files to R2
  const uploadedMedia = await uploadToR2(mediaFiles);

  // console.log({ uploadedMedia });

  const uploadedMediaWithRecommendationId: Media[] = uploadedMedia.map(
    (media) => {
      return {
        ...media,
        mediaId,
        userId,
        mediaType: mediaType as MediaType,
      };
    }
  );

  return uploadedMediaWithRecommendationId;
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
