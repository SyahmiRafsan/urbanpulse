"use server";

import { cookies } from "next/headers";
import db from "./db/drizzle";
import { recommendationTable } from "./db/schema";
import { getStop } from "./services/stop";
import { lucia } from "./auth";
import { eq } from "drizzle-orm";

export async function createRecommendation(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  console.log(rawFormData);

  const stop = await getStop(String(rawFormData.stopId));

  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId && stop) {
    const { user } = await lucia.validateSession(sessionId);

    // const response = await fetch(`${backend}/api/user`);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch user data");
    // }
    // const user: DatabaseUserAttributes = await response.json();

    if (user) {
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
        .where(eq(recommendationTable.id, recommendationId))
        .returning();

      return addedRecommendation;
    }
  }
}
