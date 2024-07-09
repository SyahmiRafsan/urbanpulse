"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import StopSearch from "./StopSearch";
import StopSearchCard from "./StopSearchCard";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import { CreateRecommendationState } from "@/lib/constants";
import RecommendationForm from "./RecommendationForm";
import Link from "next/link";
import { Button } from "./ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import DraftsButton from "./DraftsButton";

export default function CreateRecommendation() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { selectedStop } = useStopSearchStore();
  const { recommendationDrafts } = useRecommendationStore();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      (mode == CreateRecommendationState.SELECTED && selectedStop == null) ||
      (mode !== CreateRecommendationState.SEARCHING && selectedStop == null)
    ) {
      router.replace(`${pathname}?mode=searching`);
    }
  }, [mode]);

  return (
    <>
      {mode == CreateRecommendationState.SEARCHING ? (
        <div>
          <p className="px-4">
            Post your recommendation to help make public transport improvements
          </p>
          <div className="flex flex-row gap-4 my-4 justify-between items-center px-4">
            <p className="font-bold">Select Stop</p>
            <DraftsButton />
          </div>
          <StopSearch />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-4 border-b">
          <div className="bg-blue-50 p-4 border-y border-blue-100 flex flex-row gap-4 justify-between items-center">
            <div className="flex flex-col">
              <p className=" text-muted-foreground text-xs mb-2">
                Selected stop
              </p>

              {selectedStop !== null && <StopSearchCard stop={selectedStop} />}
            </div>

            <Link
              href={`/recommendation/create?mode=${CreateRecommendationState.SEARCHING}`}
            >
              <Button size={"icon"} variant={"outline"} className="shrink-0">
                <UpdateIcon />
              </Button>
            </Link>
          </div>

          <RecommendationForm />
        </div>
      )}
    </>
  );
}
