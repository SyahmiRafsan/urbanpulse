"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { Cross1Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/UserStore";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import StopSearchInput from "./StopSearchInput";

export default function SelectStopMap({ stop }: { stop?: Stop }) {
  const StopsMap = dynamic(() => import("@/components/StopsMap"), {
    ssr: false,
  });

  // const [isFullscreen, setIsFullscreen] = useState(false);
  function handleFullscreen(_isFullscreen: boolean) {
    setIsFullscreen(!_isFullscreen);
  }

  const { coordinates } = useUserStore();
  const { stops, isFullscreen, setIsFullscreen } = useStopSearchStore();

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
      <StopsMap
        stops={stops}
        userLocation={
          coordinates
            ? coordinates
            : {
                lat: 3.1582,
                lon: 101.7122,
              }
        }
        stop={stop}
      />
      <Button
        className="absolute top-3 right-2 shadow-lg"
        variant={"outline"}
        size={"icon"}
        onClick={() => handleFullscreen(isFullscreen)}
      >
        {isFullscreen ? <Cross1Icon /> : <EnterFullScreenIcon />}
      </Button>
      {isFullscreen && (
        <div className="absolute bottom-0 md:-top-1 md:right-[40px] w-full md:max-w-sm p-4 h-fit">
          <StopSearchInput />
        </div>
      )}
    </div>
  );
}
