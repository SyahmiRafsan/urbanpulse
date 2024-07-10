"use server";
import db from "@/db/drizzle";
import { dummyRecommendations } from "./dummies";

export async function getRecommendations() {
  const recommendations = await db.query.recommendationTable.findMany({
    with: { stop: true },
  });

  console.log(recommendations);
  return recommendations;
}

export async function getRecommendation(id: string) {
  const recommendation = dummyRecommendations.filter(
    (rec) => String(rec.stop_id) == id
  )[0];

  return recommendation;
}
