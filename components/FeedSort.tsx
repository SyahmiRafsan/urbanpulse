"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import { capitalizeWords } from "@/lib/utils";

export default function FeedSort() {
  const { setSortType, sortType } = useRecommendationStore();
  return (
    <Select onValueChange={(e) => setSortType(e as SortType)}>
      <SelectTrigger className="w-[150px]" defaultValue={sortType}>
        <SelectValue placeholder={capitalizeWords(sortType)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nearby">Nearby</SelectItem>
        <SelectItem value="latest">Latest</SelectItem>
        <SelectItem value="most_upvoted">Most Upvoted</SelectItem>
      </SelectContent>
    </Select>
  );
}
