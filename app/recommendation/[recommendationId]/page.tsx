"use client";

import BackButton from "@/components/BackButton";
import Nav from "@/components/Nav";
import RecommendationForm from "@/components/RecommendationForm";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import React from "react";

export default function CreateRecommendationPage({
  params,
}: {
  params: { recommendationId: string };
}) {
  const { recommendationDrafts } = useRecommendationStore();

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-10 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        <Nav />
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}
          <div className="items-start flex-col flex bg-card px-4">
            <div className="flex flex-row items-center gap-4 relative justify-start w-full">
              <BackButton />
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <h1 className="text-lg font-semibold">Edit Draft</h1>
              </div>
            </div>
          </div>
          {/* End Top */}
          {/* Start Body */}
          <div className="border-b pb-4">
            <RecommendationForm
              initialRecommendation={recommendationDrafts.find(
                (rec) => rec.id == params.recommendationId
              )}
            />
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
