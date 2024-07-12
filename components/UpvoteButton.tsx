"use client";

import { removeUpvote, upvoteRecommendation } from "@/actions";
import { cn } from "@/lib/utils";
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
  const [voted, setVoted] = useState(recommendation.userUpvoted);
  const [voteCount, setVoteCount] = useState(recommendation.upvotesCount);
  const [isLoading, setIsLoading] = useState(false);

  async function submitVote(count: number) {
    setIsLoading(true);
    const vote = await upvoteRecommendation(recommendation.id);
    setVoteCount(count + 1);
    setVoted(true);
    setIsLoading(false);
  }

  async function removeVote(count: number) {
    setIsLoading(true);
    const vote = await removeUpvote(recommendation.id);
    setVoteCount(count - 1);
    setVoted(false);
    setIsLoading(false);
  }

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, []);

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
            recommendation.userUpvoted == null
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
