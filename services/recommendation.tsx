"use server";
import db from "@/db/drizzle";
import { eq, sql } from "drizzle-orm";
import { recommendationTable, recommendationUpvotesTable } from "@/db/schema";
import { getUser } from "@/actions";

export async function getRecommendations() {
  const recommendations = await db.query.recommendationTable.findMany({
    with: { stop: true, media: true },
  });

  // console.log(recommendations);
  return recommendations;
}
// TODO getRecommendation single with id & userId
// TODO get userUpvoted
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
    with: {
      stop: true,
      comments: true,
      media: true,
      user: { columns: { id: true, name: true, image: true } },
      // upvotes: { where: eq(recommendationUpvotesTable.recommendationId, id) },
    },
    where: eq(recommendationTable.id, id),
  });

  const user = await getUser();

  const userUpvoted = user ? await hasUserUpvoted(id, user.id) : null;

  // console.log({ user, userUpvoted });

  return { ...recommendation, userUpvoted } as Recommendation;
}

async function hasUserUpvoted(
  recommendationId: string,
  userId: string
): Promise<boolean> {
  const result = await db.execute(sql<boolean>`
    SELECT EXISTS (
      SELECT 1
      FROM ${recommendationUpvotesTable}
      WHERE ${recommendationUpvotesTable.recommendationId} = ${recommendationId}
        AND ${recommendationUpvotesTable.userId} = ${userId}
    ) AS "exists"
  `);

  // console.log(result);

  return result.length > 0 && (result[0].exists as boolean);
}
