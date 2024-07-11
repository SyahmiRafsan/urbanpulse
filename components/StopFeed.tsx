"use client";

import { useRecommendationStore } from "@/stores/RecommendationStore";
import React, { useEffect, useState } from "react";
import RecommendationCard from "./RecommendationCard";
import { getRecommendations } from "@/services/recommendation";
import RecommendationSkeleton from "./RecommendationSkeleton";
import { useLocationStore } from "@/stores/LocationStore";
import { fetchRecommendationsWithUpvoteStatus } from "@/actions";

export default function StopFeed() {
  const { setRecommendations, recommendations, hasFetched, sortType } =
    useRecommendationStore();

  const [filteredRecommendations, setFilteredRecommendations] =
    useState<Recommendation[]>(recommendations);

  const { coordinates } = useLocationStore();
  async function getRecs(type: SortType) {
    const list: Recommendation[] = await fetchRecommendationsWithUpvoteStatus({
      sortType: sortType,
      userLat: coordinates.lat,
      userLon: coordinates.lon,
    });
    setFilteredRecommendations(list);
    setRecommendations(list);
  }

  function handleFilter(recommendations: Recommendation[]) {
    setFilteredRecommendations(recommendations);
  }

  useEffect(() => {
    // TODO fetch and filter after that
    if (!hasFetched) {
      getRecs("nearby");
    } else {
      getRecs(sortType);
    }
  }, [sortType]);

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
