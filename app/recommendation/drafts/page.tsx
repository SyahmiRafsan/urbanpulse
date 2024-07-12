"use client";

import BackButton from "@/components/BackButton";
import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/stores/DraftStore";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function CreateRecommendationPage() {
  const { recommendationDrafts } = useDraftStore();

  const router = useRouter();
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
                <h1 className="text-lg font-semibold">Recommendation Drafts</h1>
              </div>
            </div>
          </div>
          {/* End Top */}
          {/* Start Body */}
          <div className="border-t">
            {recommendationDrafts.length > 0 ? (
              recommendationDrafts.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() =>
                    router.push(`/recommendation/${rec.id}?draft=true`)
                  }
                  className="w-full flex items-start"
                >
                  <RecommendationCard recommendation={rec} isDraft={true} />
                </div>
              ))
            ) : (
              <div className="p-4 border-b flex flex-col w-full">
                <p>
                  You have no saved drafts. Start creating recommendations and
                  save as draft for later.
                </p>
                <Link
                  className="w-full pt-4 sm:w-fit"
                  href={"/recommendation/create"}
                >
                  <Button className="w-full sm:w-fit">
                    <PlusIcon className="mr-1" />
                    <p>Create Recommendation</p>
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
