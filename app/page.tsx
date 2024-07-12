"use client";
import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import LocationButton from "@/components/LocationButton";
import StopTypes from "@/components/StopTypes";
import { useEffect, useState } from "react";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import RecommendationSkeleton from "@/components/RecommendationSkeleton";
import { fetchRecommendationsWithUpvoteStatus } from "@/actions";
import { useLocationStore } from "@/stores/LocationStore";
import FeedSort from "@/components/FeedSort";
import { useAuth } from "@/hooks/AuthContext";

export default function Home() {
  const { setRecommendations, recommendations, hasFetched, sortType } =
    useRecommendationStore();

  const [filteredRecommendations, setFilteredRecommendations] =
    useState<Recommendation[]>(recommendations);

  const { user, hasFetched: authHasFetched } = useAuth();

  const { coordinates } = useLocationStore();
  async function getRecs(type: SortType) {
    const list: Recommendation[] = await fetchRecommendationsWithUpvoteStatus({
      userId: user?.id,
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
    if (authHasFetched) {
      if (!hasFetched) {
        getRecs("nearby");
      } else {
        getRecs(sortType);
      }
    }
  }, [sortType, authHasFetched]);

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        <Nav />
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}
          <h1 className="text-lg font-semibold px-4">Community Feed</h1>
          <div className="flex flex-row gap-4 justify-between px-4">
            <FeedSort />
            <LocationButton />
          </div>
          <div className="flex flex-row gap-2 items-center overflow-x-auto sticky top-0 bg-card">
            <div className="px-4 py-2">
              <StopTypes
                recommendationsSetter={handleFilter}
                initialList={recommendations}
              />
            </div>
          </div>
          {/* End Top */}
          {/* Start Feed */}
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
          {/* End Feed */}
        </div>
      </div>
    </main>
  );
}
