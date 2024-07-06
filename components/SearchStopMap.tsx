"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { Cross1Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/stores/LocationStore";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import StopSearchInput from "./StopSearchInput";

export default function SearchStopMap({ stop }: { stop?: Stop }) {
  const StopsMap = dynamic(() => import("@/components/StopsMap"), {
    ssr: false,
  });

  // const [isFullscreen, setIsFullscreen] = useState(false);
  function handleFullscreen(_isFullscreen: boolean) {
    setIsFullscreen(!_isFullscreen);
  }

  const { coordinates } = useLocationStore();
  const { stops, isFullscreen, setIsFullscreen } = useStopSearchStore();

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
        "object-cover transition-all w-full relative",
        isFullscreen
          ? "h-[100svh] fixed top-0 left-0 bg-primary-foreground animate-in fade-in-0"
          : "h-[30svh] md:h-[30svh] "
      )}
      onClick={
        !isFullscreen ? () => handleFullscreen(isFullscreen) : () => null
      }
    >
      <StopsMap stops={stops} userLocation={coordinates} stop={stop} />
      <Button
        className="absolute top-3 right-2 shadow-lg"
        variant={"outline"}
        size={"icon"}
        onClick={() => handleFullscreen(isFullscreen)}
      >
        {isFullscreen ? <Cross1Icon /> : <EnterFullScreenIcon />}
      </Button>
      {isFullscreen && (
        <div className="absolute bottom-0 md:-top-1 md:right-[36px] w-full md:max-w-sm p-4 h-fit">
          <StopSearchInput />
        </div>
      )}
    </div>
  );
}
