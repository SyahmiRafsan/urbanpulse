import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import {
  dummyRecommendations,
  getRecommendation,
} from "@/services/recommendation";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Stationpage({
  params,
}: {
  params: { stationName: string };
}) {
  const recommendation = getRecommendation(params.stationName);

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24">
      <div className="max-w-[700px] border w-full min-h-screen bg-background gap-5 bg-neutral-50">
        <Nav />
        <div className="flex flex-col gap-5">
          {/* Start Station */}
          <div className="bg-card pt-4">
            {/* Start Top */}
            <div className="flex flex-row px-4 items-center gap-4 pb-4">
              <Link href={"/"}>
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <img src="/icons/bus.png" className="w-5 h-5" />
                <h1 className="text-lg font-semibold">
                  {recommendation.stationName}
                </h1>
              </div>
            </div>
            {/* End Top */}
            <img
              src={recommendation.image}
              className="max-h-[175px] md:max-h-[250px] object-cover w-full"
            />
            <div className="p-4  border-b">
              <img
                src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg"
                className="max-h-[175px] md:max-h-[250px] object-cover w-full rounded-lg"
              />
            </div>
          </div>
          {/* End Station */}
          {/* Start CTA */}
          <div className="bg-card p-4 py-6 border-y flex flex-col gap-4 items-center">
            <p className="font-medium">Help to improve this station</p>
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
