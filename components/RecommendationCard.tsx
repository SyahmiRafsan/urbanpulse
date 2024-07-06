import React from "react";
import { Badge } from "./ui/badge";
import { ChatBubbleIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import slugify from "slugify";
import { getIconByStopCategory } from "@/lib/utils";

export default function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <div className="px-4 border-b py-4 animate-in slide-in-from-left-4">
      <Link
        href={`/${recommendation.category}/${slugify(recommendation.stop_name, {
          lower: true,
          strict: true,
        })}-${recommendation.stop_id}`}
        className="flex flex-row gap-1 items-center mb-2 text-sm w-fit"
      >
        <img
          src={getIconByStopCategory(recommendation.category)}
          className="w-5 h-5"
        />
        <p>{recommendation.stop_name}</p>
      </Link>
      <Link
        className="flex flex-row gap-4 w-full justify-between"
        href={`/${recommendation.category}/${slugify(recommendation.stop_name, {
          lower: true,
          strict: true,
        })}-${recommendation.stop_id}/${recommendation.id}`}
      >
        <div>
          <p className="text-xl font-bold mb-2">{recommendation.title}</p>
          <div className="flex flex-row gap-1 flex-wrap">
            <Badge variant={"muted"}>Quality of Life</Badge>
            <Badge variant={"muted"}>Safety</Badge>
            <Badge variant={"muted"}>Connectivity</Badge>
          </div>
        </div>
        <div className="w-20 h-20 ./md:w-24 /md:h-24 shrink-0">
          <img
            src={recommendation.image}
            className="aspect-square object-cover rounded-lg"
          />
        </div>
      </Link>
      <div className="mt-4 flex flex-row gap-4 justify-between">
        <p className="text-sm text-muted-foreground">4h ago</p>
        <div className="flex flex-row gap-2 items-center text-muted-foreground">
          <Link
            className="flex flex-row items-center gap-1"
            href={`/${recommendation.category}/${slugify(
              recommendation.stop_name,
              {
                lower: true,
                strict: true,
              }
            )}-${recommendation.stop_id}/${recommendation.id}`}
          >
            <ChatBubbleIcon /> <p>{recommendation.commentsCount}</p>
          </Link>
          <div className="flex flex-row items-center gap-1">
            <ThickArrowUpIcon /> <p>{recommendation.upvotesCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
