"use client";

import { CreateRecommendationState } from "@/lib/constants";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useStopSearchStore } from "@/stores/StopSearchStore";

export default function StopPageCreateButton({ stop }: { stop: Stop }) {
  const { setSelectedStop } = useStopSearchStore();
  return (
    <Link
      href={`/recommendation/create?mode=${CreateRecommendationState.SELECTED}&draft=true`}
      onClick={() => setSelectedStop(stop)}
    >
      <Button>
        <PlusIcon className="mr-1" />
        Submit Recommendation
      </Button>
    </Link>
  );
}
