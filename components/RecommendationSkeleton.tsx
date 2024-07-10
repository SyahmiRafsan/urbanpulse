import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function RecommendationSkeleton() {
  return (
    <Skeleton className="/w-[388px] w-full h-[159px] md:h-[200px] p-4 rounded-none border-b border-neutral-300">
      <Skeleton className="w-[240px] h-5 mb-2" />
      <div className="flex flex-row justify-between">
        <div>
          <Skeleton className="w-[240px] h-7 mb-2" />
          <div className="flex flex-row gap-1">
            <Skeleton className="w-20 h-[22px]" />
            <Skeleton className="w-20 h-[22px]" />
            <Skeleton className="w-20 h-[22px]" />
          </div>
        </div>
        <Skeleton className="w-20 h-20" />
      </div>
      <Skeleton className="w-[30px] h-6" />
    </Skeleton>
  );
}
