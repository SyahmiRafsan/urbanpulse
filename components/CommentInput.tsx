"use client";

import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import {
  Cross1Icon,
  ImageIcon,
  PaperPlaneIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "@/hooks/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createComment } from "@/actions";
import { getBlobFromUrl } from "@/lib/utils";

export default function CommentInput({
  recommendationId,
  addComment,
}: {
  recommendationId: string;
  addComment: (comment: RecommendationComment) => void;
}) {
  const { user, loginCheck } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const commentConfig: RecommendationComment = {
    id: uuidv4(),
    userId: user?.id || "",
    content: "",
    createdAt: DateTime.now().toJSDate(),
    recommendationId,
    media: [],
  };

  const [comment, setComment] = useState<RecommendationComment>(commentConfig);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - comment.media.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (user) {
      const newMediaPromises = filesToAdd.map(async (file) => {
        return {
          id: uuidv4(),
          file: file,
          url: URL.createObjectURL(file),
          commentId: comment.id,
          createdAt: DateTime.now().toJSDate(),
          userId: user.id,
          mimeType: file.type,
        };
      });

      try {
        const newMedia = await Promise.all(newMediaPromises);
        setComment((prev) => ({
          ...prev,
          media: [...prev.media, ...newMedia].slice(0, 3),
        }));
      } catch (error) {
        alert(`Error processing files: ${JSON.stringify(error)}`);
      }
    }
  };

  const removeFile = (id: string) => {
    setComment((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  async function handleSubmit(
    e: React.FormEvent,
    user: DatabaseUserAttributes
  ) {
    e.preventDefault();
    setIsLoading(true);
    if (loginCheck()) {
      //   alert(comment);

      const formData = new FormData();

      // Append form fields
      Object.entries(comment).forEach(([key, value]) => {
        if (key !== "media" && key !== "highlights") {
          formData.append(key, value as string);
        }
      });

      // Append media files
      const mediaPromises = comment.media.map(async (media) => {
        if (media.file) {
          if (media.url.startsWith("blob:")) {
            const blob = await getBlobFromUrl(media.url);
            formData.append(
              `media_${media.id}`,
              blob,
              `${media.id}.${media.mimeType.split("/")[1]}`
            );
          } else {
            formData.append(
              `media_${media.id}`,
              media.file,
              `${media.id}.${media.mimeType.split("image/")[1]}`
            );
          }
        }
      });

      await Promise.all([...mediaPromises]);

      // console.log(formData);

      const addedComment = await createComment(formData);

      // console.log(addedComment);

      addComment({
        ...addedComment,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
          email: "",
        },
      });

      setComment(commentConfig);
    }

    setIsLoading(false);
  }

  return (
    <>
      <div className="flex flex-row w-full gap-2 pb-4">
        {user && (
          <img src={user?.image} className="w-5 h-5 rounded-full border" />
        )}
        <form
          className="w-full border rounded-lg"
          onSubmit={user ? (e) => handleSubmit(e, user) : () => null}
        >
          <Textarea
            placeholder="Add a comment"
            className="border-0 shadow-none focus-visible:ring-transparent px-2"
            value={comment.content}
            onChange={(e) =>
              setComment((cmt) => ({ ...cmt, content: e.target.value }))
            }
            onClick={() => loginCheck()}
            required
          />
          <div className="flex flex-row justify-between gap-4 items-center my-2 px-2">
            <button type="button">
              <Label htmlFor="picture">
                <ImageIcon />
              </Label>
              <Input
                id="picture"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
                disabled={comment.media.length == 3}
              />
            </button>

            <button type="submit" disabled={isLoading}>
              {!isLoading ? <PaperPlaneIcon /> : <UpdateIcon className="animate-spin" />}
            </button>
          </div>
          <div>
            {comment.media.length > 0 && (
              <div className="flex flex-row gap-2 overflow-x-auto p-2 border-t">
                {comment.media.map((media) => (
                  <div
                    key={media.id}
                    className="relative flex-shrink-0 animate-in slide-in-from-top-4 transition-all"
                  >
                    <img
                      src={media.url}
                      className="rounded-lg w-[100px] h-[66px] aspect-video object-cover shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(media.id)}
                      className="absolute top-1 right-1 rounded-full bg-neutral-50 border p-1"
                    >
                      <Cross1Icon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
      {/* <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(comment, null, 2)}
      </pre> */}
    </>
  );
}
