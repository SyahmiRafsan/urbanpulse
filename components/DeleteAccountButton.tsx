"use client";

import React, { ReactNode, useState } from "react";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function DeleteAccountButton({
  handleDelete,
  children,
}: {
  handleDelete: () => Promise<void>;
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [typed, setTyped] = useState("");

  const typedConfirmed = "delete my account";

  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogDescription>
            Your account together with all previously created recommendations &
            comments will be permanently deleted. You cannot undo this action.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Label htmlFor="input">
            Type &quot;{typedConfirmed}&quot; to continue
          </Label>
          <Input
            id="input"
            placeholder={typedConfirmed}
            onChange={(e) => setTyped(e.target.value)}
          />
        </div>
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
            disabled={isLoading || typed !== typedConfirmed}
          >
            {isLoading && <UpdateIcon className="animate-spin mr-1" />} Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
