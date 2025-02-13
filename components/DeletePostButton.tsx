"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useDraftStore } from "@/stores/DraftStore";
import { deleteRecommendation } from "@/actions";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import { useAuth } from "@/hooks/AuthContext";

export default function DeletePostButton({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const isDraft = searchParams.get("draft");

  const { removeDraft } = useDraftStore();
  const {
    setRecommendations,
    setRecommendationsUser,
    recommendations,
    recommendationsUser,
  } = useRecommendationStore();

  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    if (isDraft) {
      removeDraft(recommendation);
      router.replace("/recommendation/drafts");
    } else {
      await deleteRecommendation(recommendation);
      setRecommendations(
        recommendations.filter((rc) => rc.id !== recommendation.id),
        false
      );
      setRecommendationsUser(
        recommendationsUser.filter((rc) => rc.id !== recommendation.id),
        false
      );
      router.replace("/");
    }

    setOpen(false);
    setIsLoading(false);
  }

  return (
    <>
      {user && recommendation.userId == user.id && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={"link-destructive"} size={"none"} type="button">
              <TrashIcon className="mr-1" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete {isDraft ? "Draft" : "Post"}?</DialogTitle>
              <DialogDescription>
                Your {isDraft ? "draft" : "post"} will be permanently deleted.
                You cannot undo this action.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-4 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => handleDelete()}
                disabled={isLoading}
              >
                {isLoading && <UpdateIcon className="animate-spin mr-1" />}{" "}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
