import Nav from "@/components/Nav";
import React from "react";

import { getStopJSON } from "@/services/stop";
import {
  getCategoryWithoutBus,
  getIconByStopCategory,
  truncateString,
} from "@/lib/utils";
import BackButton from "@/components/BackButton";
import StopMap from "@/components/StopMap";
import { notFound } from "next/navigation";
import StopPageCreateButton from "@/components/StopPageCreateButton";
import StopFeed from "@/components/StopFeed";
import FeedSort from "@/components/FeedSort";

export default async function StopPage({
  params,
}: {
  params: { stop_name: string };
}) {
  const stopId = params.stop_name.split("-").slice(-1)[0];

  const stop = getStopJSON(stopId);

  if (!stop) {
    notFound();
  }

  return (
    <>
      {stop && (
        <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24">
          <div className="max-w-[700px] border-x w-full min-h-screen bg-background gap-4 bg-neutral-50">
            <Nav />
            <div className="flex flex-col gap-4">
              {/* Start Stop */}
              <div className="bg-card pt-4">
                {/* Start Top */}
                <div className="flex flex-row px-4 items-center gap-4 pb-4 relative justify-start w-full">
                  <BackButton />
                  <div className="flex flex-row gap-1 items-center text-sm w-fit">
                    <img
                      src={getIconByStopCategory(stop.category as Category)}
                      className="w-5 h-5"
                    />
                    <h1 className="text-lg font-semibold whitespace-nowrap flex md:hidden">
                      {getCategoryWithoutBus(stop.category.toLocaleUpperCase())}{" "}
                      {truncateString(stop.stop_name, 25)}
                    </h1>
                    <h1 className="text-lg font-semibold whitespace-nowrap hidden md:flex">
                      {getCategoryWithoutBus(stop.category.toLocaleUpperCase())}{" "}
                      {truncateString(stop.stop_name, 50)}{" "}
                    </h1>
                  </div>
                </div>
                {/* End Top */}
                <img
                  src={`/dummy/${stop.category?.toLowerCase()}.png`}
                  className="max-h-[175px] md:max-h-[250px] object-cover w-full"
                />

                <div className="border-b p-4">
                  <StopMap stop={stop} />
                </div>
                {/* <p>{stop.stop_id}</p> */}
              </div>
              {/* End Stop */}
              {/* Start CTA */}
              <div className="bg-card p-4 py-6 border-y flex flex-col gap-4 items-center">
                <p className="font-medium">Help to improve this stop</p>
                <StopPageCreateButton stop={stop} />
              </div>
              {/* End CTA */}
              {/* Start Feed */}
              <div className="bg-card border-t pt-4">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <h2 className="text-lg font-semibold px-4">Community Feed</h2>
                  <div className="px-4 my-2">
                    <FeedSort />
                  </div>
                </div>
                <StopFeed />
              </div>
              {/* End Feed */}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
