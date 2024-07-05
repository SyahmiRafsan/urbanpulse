import BackButton from "@/components/BackButton";
import Nav from "@/components/Nav";
import StopSearch from "@/components/StopSearch";
import React, { Suspense } from "react";

export default function CreateRecommendationPage() {
  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-5">
        <Nav />
        <div className="flex flex-col gap-5 pt-4">
          {/* Start Top */}
          <div className="items-start flex-col flex bg-card px-4">
            <div className="flex flex-row items-center gap-4 relative justify-start w-full pb-2">
              <BackButton />
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <h1 className="text-lg font-semibold">Create Recommendation</h1>
              </div>
            </div>
          </div>
          {/* End Top */}
          {/* Start Feed */}
          <div>
            <p className="px-4">
              Post your recommendation to help make public transport
              improvements
            </p>
            <p className="font-bold my-4 px-4">Select Stop</p>

            <Suspense>
              <StopSearch />
            </Suspense>
          </div>
          {/* End Feed */}
        </div>
      </div>
    </main>
  );
}
