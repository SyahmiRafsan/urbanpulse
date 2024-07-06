"use client";

import React, { useEffect, useState } from "react";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { Cross1Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/stores/LocationStore";

export default function StopMap({ stop }: { stop?: Stop }) {
  const StopsMap = dynamic(() => import("@/components/StopsMap"), {
    ssr: false,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  function handleFullscreen(_isFullscreen: boolean) {
    setIsFullscreen(!_isFullscreen);
  }

  const { coordinates } = useLocationStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    // Add event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={cn(
        "object-cover transition-all w-full rounded-lg overflow-clip relative",
        isFullscreen
          ? "h-[100svh] fixed top-0 left-0 bg-primary-foreground animate-in fade-in-0"
          : "h-[175px] md:h-[250px] "
      )}
      onClick={
        !isFullscreen ? () => handleFullscreen(isFullscreen) : () => null
      }
    >
      <StopsMap stops={ALL_STOPS} userLocation={coordinates} stop={stop} />
      <Button
        className="absolute top-2 right-2 shadow-lg z-50"
        variant={"outline"}
        size={"icon"}
        onClick={() => handleFullscreen(isFullscreen)}
      >
        {isFullscreen ? <Cross1Icon /> : <EnterFullScreenIcon />}
      </Button>
    </div>
  );
}
