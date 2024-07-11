"use server";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { recommendationTable } from "@/db/schema";

export async function getRecommendations() {
  const recommendations = await db.query.recommendationTable.findMany({
    with: { stop: true, media: true },
  });

  // console.log(recommendations);
  return recommendations;
}
// TODO getRecommendation single with id & userId
export async function getRecommendationsByUserId(userId: string) {
  const recommendations = await db.query.recommendationTable.findMany({
    where: eq(recommendationTable.userId, userId),
    with: { stop: true, media: true },
  });

  // console.log(recommendations);
  return recommendations;
}

export async function getRecommendation(id: string) {
  // const recommendation = dummyRecommendations.filter(
  //   (rec) => String(rec.stop_id) == id
  // )[0];

  const recommendation = await db.query.recommendationTable.findFirst({
    with: { stop: true, comments: true, media: true, user: true },
    where: eq(recommendationTable.id, id),
  });

  // console.log(recommendation);

  return recommendation;
}
