"use client";

import React, { useState } from "react";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

export default function MainCommentCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const [comments, setComments] = useState<RecommendationComment[]>(
    recommendation.comments || []
  );

  function addComment(comment: RecommendationComment) {
    setComments((prev) => [comment, ...prev]);
  }

  function removeComment(comment: RecommendationComment) {
    setComments((prev) => prev.filter((cmt) => cmt.id !== comment.id));
  }

  return (
    <div className="bg-card border-y pt-4 flex flex-col gap-4">
      <h2 className="text-sm font-semibold px-4">
        Comments ({comments.length})
      </h2>
      <div className="px-4">
        <CommentInput
          recommendationId={recommendation.id}
          addComment={addComment}
        />
      </div>
      <div className="flex flex-col">
        {comments.length > 0 &&
          comments.map((cmt) => (
            <CommentCard
              key={cmt.id}
              comment={cmt}
              removeComment={removeComment}
            />
          ))}
      </div>
    </div>
  );
}
