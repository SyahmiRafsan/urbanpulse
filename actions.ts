"use server";

import { cookies } from "next/headers";
import { getStop } from "@/services/stop";
import { lucia } from "@/auth";
import { uploadToR2 } from "@/lib/r2";
import db from "./db/drizzle";
import { recommendationTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createRecommendation(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  console.log(rawFormData);

  const stop = await getStop(String(rawFormData.stopId));

  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId && stop) {
    const { user } = await lucia.validateSession(sessionId);

    if (user) {
      // Extract media files from FormData
      const mediaFiles: UploadedFile[] = [];

      const entries = Array.from(formData.entries());
      for (const [key, value] of entries) {
        if (key.startsWith("media_") && value instanceof File) {
          mediaFiles.push({
            key: value.name,
            buffer: Buffer.from(await value.arrayBuffer()), // Convert File to Buffer
            originalname: value.name,
            mimetype: value.type,
          });
        }
      }

      console.log({ mediaFiles });

      // Upload media files to R2
      // const uploadedMediaUrls = await uploadToR2(mediaFiles);

      // console.log({ uploadedMediaUrls });

      // const media = Object.entries(uploadedMediaUrls).map(([key, url]) => ({
      //   id: key.replace("media_", ""),
      //   userId: user.id,
      //   createdAt: new Date(),
      //   url,
      //   mediaId: rawFormData.id as string,
      //   mediaType: "RECOMMENDATION" as MediaType,
      // }));

      // console.log(media);

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
            (h) =>
              h.toUpperCase().replaceAll(" ", "_") as RecommendationHighlight
          ),
      };

      const addedRecommendation = await db
        .insert(recommendationTable)
        .values([formObj])
        .returning();

      return addedRecommendation;
    }
  }
}

export async function updateRecommendation(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  console.log(rawFormData);

  const recommendationId = rawFormData.id as string;
  const stop = await getStop(String(rawFormData.stopId));

  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId && stop && recommendationId) {
    const { user } = await lucia.validateSession(sessionId);

    // const response = await fetch(`${backend}/api/user`);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch user data");
    // }
    // const user: DatabaseUserAttributes = await response.json();

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
            (h) =>
              h.toUpperCase().replaceAll(" ", "_") as RecommendationHighlight
          ),
      };

      const addedRecommendation = await db
        .update(recommendationTable)
        .set(formObj)
        .where(
          and(
            eq(recommendationTable.id, recommendationId),
            eq(recommendationTable.userId, user.id)
          )
        )
        .returning();

      return addedRecommendation;
    }
  }
}

export async function deleteRecommendation(recommendationId: string) {
  const deletedRecommendation = await db
    .delete(recommendationTable)
    .where(eq(recommendationTable.id, recommendationId))
    .returning();

  return deletedRecommendation;
}
