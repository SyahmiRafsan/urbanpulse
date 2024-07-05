"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

function BackButton() {
  const router = useRouter();
  function handleGoBack() {
    if (window.history?.length && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }
  return (
    <Button onClick={() => handleGoBack()} variant={"ghost"} size={"icon"}>
      <ArrowLeftIcon className="w-5 h-5" />
    </Button>
  );
}

export default BackButton;
