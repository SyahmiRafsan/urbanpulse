import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { dummyRecommendations } from "@/services/recommendation";
import { ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStop } from "@/services/stop";
import { getIconByStopCategory, truncateString } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import StopMap from "@/components/StopMap";

export default function StopPage({
  params,
}: {
  params: { stop_name: string };
}) {
  const stopId = params.stop_name.split("-").slice(-1)[0];

  const stop = getStop(stopId);

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24">
      <div className="max-w-[700px] border-x w-full min-h-screen bg-background gap-5 bg-neutral-50">
        <Nav />
        <div className="flex flex-col gap-5">
          {/* Start Stop */}
          <div className="bg-card pt-4">
            {/* Start Top */}
            <div className="flex flex-row px-4 items-center gap-4 pb-4 relative justify-start w-full">
              <BackButton />
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <img
                  src={getIconByStopCategory(stop.category)}
                  className="w-5 h-5"
                />
                <h1 className="text-lg font-semibold whitespace-nowrap">
                  {truncateString(stop.stop_name, 25)}
                </h1>
              </div>
            </div>
            {/* End Top */}
            <img
              src={`/dummy/${stop.category}.png`}
              className="max-h-[175px] md:max-h-[250px] object-cover w-full"
            />
            <div className="border-b">
              <div className="h-full h-[175px] md:h-[250px] object-cover w-full">
                <StopMap stop={stop} />
              </div>
            </div>
            {/* <p>{stop.stop_id}</p> */}
          </div>
          {/* End Stop */}
          {/* Start CTA */}
          <div className="bg-card p-4 py-6 border-y flex flex-col gap-4 items-center">
            <p className="font-medium">Help to improve this stop</p>
            <Button>
              <PlusIcon className="mr-1" />
              Submit Recommendation
            </Button>
          </div>
          {/* End CTA */}
          {/* Start Feed */}
          <div className="bg-card border-t pt-4">
            <h2 className="text-lg font-semibold px-4">Community Feed</h2>
            <div className="px-4 mb-2">
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
            </div>
            {dummyRecommendations.map((rec) => (
              <div key={rec.id}>
                <RecommendationCard recommendation={rec} />
              </div>
            ))}
          </div>
          {/* End Feed */}
        </div>
      </div>
    </main>
  );
}
