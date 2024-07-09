"use client";

import BackButton from "@/components/BackButton";
import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import Link from "next/link";
import React from "react";

export default function CreateRecommendationPage() {
  const { recommendationDrafts } = useRecommendationStore();

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        {/* <Nav /> */}
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}
          <div className="items-start flex-col flex bg-card px-4">
            <div className="flex flex-row items-center gap-4 relative justify-start w-full">
              <BackButton />
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <h1 className="text-lg font-semibold">Recommendation Drafts</h1>
              </div>
            </div>
          </div>
          {/* End Top */}
          {/* Start Body */}
          <div className="border-t">
            {recommendationDrafts.length > 0 ? (
              recommendationDrafts.map((rec) => (
                <Link key={rec.id} href={`/recommendation/${rec.id}`}>
                  <RecommendationCard recommendation={rec} isDraft={true} />
                </Link>
              ))
            ) : (
              <div className="p-4 border-b">
                <p>
                  No saved draft so far. You can start creating recommendation
                  and save as draft for later.
                </p>
              </div>
            )}
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
