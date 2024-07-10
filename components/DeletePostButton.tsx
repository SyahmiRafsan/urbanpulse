import React from "react";
import { Button } from "./ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeletePostButton() {
  return (
    <Button variant={"link-destructive"} size={"none"} type="button">
      <TrashIcon className="mr-1" />
      Delete
    </Button>
  );
}
