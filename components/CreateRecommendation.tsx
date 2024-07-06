"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StopSearch from "./StopSearch";
import StopSearchCard from "./StopSearchCard";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import {
  CreateRecommendationState,
  RecommendationHighlights,
} from "@/lib/constants";
import { Badge } from "./ui/badge";
import RecommendationForm from "./RecommendationForm";

export default function CreateRecommendation() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { selectedStop } = useStopSearchStore();
  const { recommendationDrafts } = useRecommendationStore();

  return (
    <>
      {mode == CreateRecommendationState.SEARCHING ? (
        <div>
          <p className="px-4">
            Post your recommendation to help make public transport improvements
          </p>
          <div className="flex flex-row gap-4 my-4 justify-between items-center px-4">
            <p className="font-bold">Select Stop</p>
            <Badge variant={"outline"}>
              {recommendationDrafts.length}{" "}
              {recommendationDrafts.length > 1 ? "drafts" : "draft"}
            </Badge>
          </div>
          <StopSearch />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-4 border-b">
          <div className="bg-blue-50 p-4 border-y border-blue-100">
            <p className=" text-muted-foreground text-xs mb-2">Selected stop</p>
            {selectedStop !== null && <StopSearchCard stop={selectedStop} />}
          </div>

          <RecommendationForm />
        </div>
      )}
    </>
  );
}
