"use client";

import BackButton from "@/components/BackButton";
import Nav from "@/components/Nav";
import RecommendationForm from "@/components/RecommendationForm";
import StopSearchCard from "@/components/StopSearchCard";
import { useAuth } from "@/hooks/AuthContext";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import { getRecommendationsByUserId } from "@/services/recommendation";
import { useDraftStore } from "@/stores/DraftStore";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CreateRecommendationPage({
  params,
}: {
  params: { recommendationId: string };
}) {
  const { recommendationDrafts } = useDraftStore();
  const { hasFetchedUser, setRecommendationsUser, recommendationsUser } =
    useRecommendationStore();
  const { user, hasFetched, loggedIn } = useAuth();
  const router = useRouter();
  const [foundRecommendation, setFoundRecommendation] =
    useState<Recommendation>();

  useEffect(() => {
    if (hasFetched && !loggedIn) {
      router.push("/login");
    }
  }, [hasFetched]);

  const foundDraft = recommendationDrafts.find(
    (rec) => rec.id == params.recommendationId
  );

  useEffect(() => {
    async function getRecs(userId: string) {
      const list: Recommendation[] = await getRecommendationsByUserId(userId);

      // console.log(list);
      setRecommendationsUser(list);

      const foundRec = list.find((rec) => rec.id == params.recommendationId);

      console.log(foundRec);
      setFoundRecommendation(foundRec);
    }

    console.log(foundDraft);
    // console.log(user);

    if (!foundDraft && user) {
      console.log("running");
      getRecs(user.id);
    } else {
      console.log("fd draft");
      setFoundRecommendation(foundDraft);
    }
  }, [user]);

  const foundStop = foundRecommendation
    ? ALL_STOPS.find((st) => st.stop_id == foundRecommendation.stop.stopId)
    : null;

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        <Nav />
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}
          <div className="items-start flex-col flex bg-card px-4">
            <div className="flex flex-row items-center gap-4 relative justify-start w-full">
              <BackButton />
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <h1 className="text-lg font-semibold">
                  Edit {foundDraft ? "Draft" : "Post"}
                </h1>
              </div>
            </div>
          </div>
          {/* End Top */}
          {/* Start Body */}
          <div className="bg-blue-50 p-4 border-y border-blue-100 flex flex-row gap-4 justify-between items-center">
            <div className="flex flex-col">
              <p className=" text-muted-foreground text-xs mb-2">
                Selected stop
              </p>

              {foundRecommendation && foundStop && (
                <StopSearchCard stop={foundStop} />
              )}
            </div>
          </div>

          <div className="border-b pb-4">
            {foundRecommendation && (
              <RecommendationForm initialRecommendation={foundRecommendation} />
            )}
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
