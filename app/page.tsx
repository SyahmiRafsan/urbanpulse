"use client";
import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dummyRecommendations } from "@/services/recommendation";
import LocationButton from "@/components/LocationButton";
import StopTypes from "@/components/StopTypes";
import { useState } from "react";

export default function Home() {
  const [filteredRecommendations, setFilteredRecommendations] =
    useState<Recommendation[]>(dummyRecommendations);

  function handleFilter(recommendations: Recommendation[]) {
    setFilteredRecommendations(recommendations);
  }
  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-5">
        <Nav />
        <div className="flex flex-col gap-5 pt-4">
          {/* Start Top */}
          <h1 className="text-lg font-semibold px-4">Community Feed</h1>
          <div className="flex flex-row gap-4 justify-between px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-row items-center">
                  <p className="font-medium">Nearby</p>
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Nearby</DropdownMenuItem>
                  <DropdownMenuItem>Latest</DropdownMenuItem>
                  <DropdownMenuItem>Most upvoted</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <LocationButton />
          </div>
          <div className="flex flex-row gap-2 items-center overflow-x-auto">
            <div className="px-4">
              <StopTypes
                recommendationsSetter={handleFilter}
                initialList={dummyRecommendations}
              />
            </div>
          </div>
          {/* End Top */}
          {/* Start Feed */}
          <div>
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec) => (
                <div key={rec.id}>
                  <RecommendationCard recommendation={rec} />
                </div>
              ))
            ) : (
              <div className="p-4 border-y">No recommendations found.</div>
            )}
          </div>
          {/* End Feed */}
        </div>
      </div>
    </main>
  );
}
