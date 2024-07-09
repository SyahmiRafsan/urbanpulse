import React from "react";
import { Badge } from "./ui/badge";
import { ChatBubbleIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import slugify from "slugify";
import { getIconByStopCategory, getRelativeTime } from "@/lib/utils";
import { DateTime } from "luxon";

export default function RecommendationCard({
  recommendation,
  isDraft = false,
}: {
  recommendation: Recommendation;
  isDraft?: boolean;
}) {
  return (
    <div className="px-4 border-b py-4 animate-in slide-in-from-left-4 z-10">
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
        href={
          !isDraft
            ? `/${recommendation.category}/${slugify(recommendation.stop_name, {
                lower: true,
                strict: true,
              })}-${recommendation.stop_id}/${recommendation.id}`
            : `/recommendation/${recommendation.id}`
        }
      >
        <div>
          <p className="text-xl font-bold mb-2">{recommendation.title}</p>
          <div className="flex flex-row gap-1 flex-wrap">
            {recommendation.highlights.map((hl) => (
              <Badge variant={"muted"} key={hl + recommendation.id}>
                {hl}
              </Badge>
            ))}
          </div>
        </div>
        {recommendation.media.length > 0 &&
          !recommendation.media[0]?.url.startsWith("blob:") && (
            <div className="w-20 h-20 ./md:w-24 /md:h-24 shrink-0">
              <img
                src={recommendation.media[0]?.url}
                className="aspect-square object-cover rounded-lg"
              />
            </div>
          )}
      </Link>
      <div className="mt-4 flex flex-row gap-4 justify-between">
        <p className="text-sm text-muted-foreground">
          {getRelativeTime(recommendation.createdAt)} ago
          {/* ·{" "}
          {DateTime.fromISO(recommendation.createdAt).toFormat(
            "d/M/yy (h:mma)"
          )} */}
        </p>
        {!isDraft && (
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
        )}
      </div>
    </div>
  );
}
