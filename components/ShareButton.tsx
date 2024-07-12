"use client";

import { Share2Icon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import React from "react";

export default function ShareButton({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const pathname = usePathname();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recommendation.title,
          text: recommendation.description,
          url: pathname,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content: ", error);
      }
    } else {
      console.log("Share API not supported in this browser");
    }
  };

  return (
    <button
      className="flex flex-row items-center justify-center w-full p-4 md:px-6"
      onClick={() => handleShare()}
    >
      <Share2Icon />
    </button>
  );
}
