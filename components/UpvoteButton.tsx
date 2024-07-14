"use client";

import { removeUpvoteRecommendation, upvoteRecommendation } from "@/actions";
import useIsClient from "@/hooks/useIsClient";
import { cn } from "@/lib/utils";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import React, { useEffect, useState } from "react";

interface UpvoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  recommendation: Recommendation;
}

function UpvoteButton({
  recommendation,
  className,
  ...props
}: UpvoteButtonProps) {
  const {
    setRecommendations,
    recommendations,
    hasFetched,
    setRecommendationsUser,
    recommendationsUser,
    hasFetchedUser,
  } = useRecommendationStore();

  const [voted, setVoted] = useState(recommendation.userUpvoted);
  const [voteCount, setVoteCount] = useState(recommendation.upvotesCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVoteCount(recommendation.upvotesCount);
  }, [recommendation.upvotesCount]);

  async function submitVote(count: number) {
    setIsLoading(true);
    const vote = await upvoteRecommendation(recommendation.id);
    const addedCount = count + 1;
    setVoteCount(addedCount);
    setVoted(true);
    setIsLoading(false);

    setRecommendations(
      recommendations.map((rec) =>
        rec.id == recommendation.id
          ? { ...rec, upvotesCount: addedCount, userUpvoted: true }
          : rec
      ),
      hasFetched ? true : false
    );

    setRecommendationsUser(
      recommendationsUser.map((rec) =>
        rec.id == recommendation.id
          ? { ...rec, upvotesCount: addedCount, userUpvoted: true }
          : rec
      ),
      hasFetchedUser ? true : false
    );
  }

  async function removeVote(count: number) {
    setIsLoading(true);
    const vote = await removeUpvoteRecommendation(recommendation.id);
    const deletedCount = count - 1;
    setVoteCount(deletedCount);
    setVoted(false);
    setIsLoading(false);

    setRecommendations(
      recommendations.map((rec) =>
        rec.id == recommendation.id
          ? { ...rec, upvotesCount: deletedCount, userUpvoted: false }
          : rec
      ),
      hasFetched ? true : false
    );

    setRecommendationsUser(
      recommendationsUser.map((rec) =>
        rec.id == recommendation.id
          ? { ...rec, upvotesCount: deletedCount, userUpvoted: false }
          : rec
      ),
      hasFetchedUser ? true : false
    );
  }

  const isClient = useIsClient();

  return (
    <>
      {isClient && (
        <button
          key={recommendation.id + voted + voteCount}
          className={cn(
            className,
            "flex flex-row items-center gap-1 min-w-[30px] ",
            isLoading ? "animate-pulse" : "animate-in",
            voteCount == 1 ? "slide-in-from-bottom-1" : "slide-in-from-top-1"
          )}
          disabled={isLoading}
          onClick={
            voted == null
              ? () => null
              : voted
              ? () => removeVote(voteCount)
              : () => submitVote(voteCount)
          }
          {...props}
        >
          <img
            src={`/icons/vote_${voted ? true : false}.svg`}
            className="w-4 h-4 shrink-0"
          />
          <p className={cn(voted ? "text-orange-500" : "")}>{voteCount}</p>
        </button>
      )}
    </>
  );
}

export default UpvoteButton;
