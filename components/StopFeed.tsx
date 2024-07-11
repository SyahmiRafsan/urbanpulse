"use client"

import { useRecommendationStore } from "@/stores/RecommendationStore";
import React, { useEffect, useState } from "react";
import RecommendationCard from "./RecommendationCard";
import { getRecommendations } from "@/services/recommendation";
import RecommendationSkeleton from "./RecommendationSkeleton";

export default function StopFeed() {
  const { setRecommendations, recommendations, hasFetched } =
    useRecommendationStore();

  const [filteredRecommendations, setFilteredRecommendations] =
    useState<Recommendation[]>(recommendations);

  useEffect(() => {
    async function getRecs() {
      const list: Recommendation[] = await getRecommendations();
      // console.log(list);
      setFilteredRecommendations(list);
      setRecommendations(list);
    }
    if (!hasFetched) {
      getRecs();
    }
  }, []);

  function handleFilter(recommendations: Recommendation[]) {
    setFilteredRecommendations(recommendations);
  }
  return (
    <div>
    {hasFetched ? (
      filteredRecommendations?.length > 0 ? (
        filteredRecommendations.map((rec) => (
          <div key={rec.id}>
            <RecommendationCard recommendation={rec} />
          </div>
        ))
      ) : (
        <div className="p-4 border-y">No recommendations found.</div>
      )
    ) : (
      [1, 2, 3, 4, 5].map((s) => <RecommendationSkeleton key={s} />)
    )}
  </div>
  );
}
