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

export default function DeleteCommentButton({
  handleDelete,
}: {
  handleDelete: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link-destructive"} size={"none"} type="button">
          <TrashIcon className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Comment?</DialogTitle>
          <DialogDescription>
            Your comment will be permanently deleted. You cannot undo this
            action.
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
            onClick={() => [handleDelete(), setIsLoading(true)]}
            disabled={isLoading}
          >
            {isLoading && <UpdateIcon className="animate-spin mr-1" />} Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
