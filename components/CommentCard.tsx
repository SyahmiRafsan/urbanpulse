import { useAuth } from "@/hooks/AuthContext";
import { getRelativeTime } from "@/lib/utils";
import { useImageStore } from "@/stores/ImageStore";
import { TrashIcon } from "@radix-ui/react-icons";
import React from "react";

export default function CommentCard({
  comment,
  deleteComment,
}: {
  comment: RecommendationComment;
  deleteComment: (comment: RecommendationComment) => void;
}) {
  const { user } = useAuth();
  const { setImage } = useImageStore();
  return (
    <div className="bg-card border-t py-4 pl-4 flex flex-row gap-2">
      <img src={comment.user?.image} className="rounded-full w-5 h-5" />

      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center pr-4">
          <p className="font-medium">{comment.user?.name}</p>
          <p className="text-muted-foreground text-sm">
            • {getRelativeTime(comment.createdAt)}
          </p>
        </div>
        <div className="flex flex-col gap-2 pr-4">
          <p className="whitespace-break-spaces">{comment.content}</p>
        </div>
        {comment.media.length > 0 && (
          <div className="flex flex-row gap-4 overflow-x-auto pR-4">
            {comment.media.map((media) => (
              <img
                src={media.url}
                key={media.id}
                className="rounded-lg w-[100px] h-[66px] aspect-video object-cover shadow-sm border"
                onClick={() => setImage(media)}
              />
            ))}
          </div>
        )}
        {user && user.id && comment.userId && (
          <div className="">
            <button onClick={() => deleteComment(comment)}>
              <TrashIcon className="text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
