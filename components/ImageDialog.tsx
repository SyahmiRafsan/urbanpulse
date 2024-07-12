"use client";

import { useImageStore } from "@/stores/ImageStore";
import React from "react";
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
import { Button } from "./ui/button";

export default function ImageDialog() {
  const { isOpen, image, clearImage } = useImageStore();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={clearImage}>
      <DialogContent className="md:max-w-fit p-2">
        {/* <DialogHeader>
          <DialogTitle>Delete {isDraft ? "Draft" : "Post"}?</DialogTitle>
          <DialogDescription>
            Your {isDraft ? "draft" : "post"} will be permanently deleted. You
            cannot undo this action.
          </DialogDescription>
        </DialogHeader> */}
        <img src={image?.url} className="w-full h-fit rounded-lg border" />
        <DialogFooter className="mt-4 gap-4 flex hidden">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => clearImage()}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
