"use server";

import { cookies } from "next/headers";
import { getStop } from "@/services/stop";
import { lucia } from "@/auth";
import { deleteFromR2, uploadToR2 } from "@/lib/r2";
import db from "./db/drizzle";
import { mediaTable, recommendationTable } from "@/db/schema";
import { and, eq, ExtractTablesWithRelations } from "drizzle-orm";
import { cache } from "react";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import { arraysEqualUploadFile, getArrayDifferences } from "./lib/utils";

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

      const uploadedMediaWithRecommendationId = await uploadMedia(
        formData,
        rawFormData.id as string,
        user.id,
        "RECOMMENDATION"
      );

      const addMediaTx = await tx
        .insert(mediaTable)
        .values(uploadedMediaWithRecommendationId)
        .returning();

      const recommendationWithMedia = {
        ...addRecTx,
        media: uploadedMediaWithRecommendationId,
      };

      // console.log({recommendationWithMedia})

      return recommendationWithMedia;
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

        // console.log({ oldMedia, newMedia });

        // console.log({
        //   mediaAdded: mediaAdded.length,
        //   mediaDeleted: mediaDeleted.length,
        // });

        // console.log({
        //   mediaAdded: mediaAdded,
        //   mediaDeleted: mediaDeleted,
        // });

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

          // console.log({ deletedUrls });
        }

        if (mediaAdded.length > 0) {
          const appendedNewMedia = getArrayDifferences(
            oldMedia,
            newMedia
          ).added;

          // console.log({ oldMedia, newMedia, appendedNewMedia });

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
