"use client";

import { useImageStore } from "@/stores/ImageStore";
import React from "react";

export default function RecommendationImage({ media }: { media: Media }) {
  const { setImage } = useImageStore();

  return (
    <img
      onClick={() => setImage(media)}
      src={media.url}
      key={media.id}
      className="rounded-lg w-[200px] h-[133px] aspect-video object-cover shadow-sm border cursor pointer"
    />
  );
}
