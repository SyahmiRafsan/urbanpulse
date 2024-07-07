"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { Cross1Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/stores/LocationStore";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import StopSearchInput from "./StopSearchInput";
import StopSearchCard from "./StopSearchCard";
import { usePathname, useRouter } from "next/navigation";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import Link from "next/link";
import { Badge } from "./ui/badge";

export default function StopSearchMap({ stop }: { stop?: Stop }) {
  const StopsMap = dynamic(() => import("@/components/StopsMap"), {
    ssr: false,
  });

  // const [isFullscreen, setIsFullscreen] = useState(false);
  function handleFullscreen(_isFullscreen: boolean) {
    setIsFullscreen(!_isFullscreen);
  }

  const { coordinates } = useLocationStore();
  const { stops, isFullscreen, setIsFullscreen, selectedStop } =
    useStopSearchStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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

  const router = useRouter();
  const pathname = usePathname();

  const { recommendationDrafts } = useRecommendationStore();
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
        <Link
          href={`/recommendation/drafts`}
          className="absolute top-4 right-14 shadow-lg"
        >
          <Badge>
            {recommendationDrafts.length}{" "}
            {recommendationDrafts.length > 1 ? "drafts" : "draft"}
          </Badge>
        </Link>
      )}
      {isFullscreen && (
        <div className="absolute bottom-0 md:-top-1 md:right-[130px] w-full md:max-w-sm /p-4 h-fit">
          <div className="p-4 md:px-0">
            <StopSearchInput />
          </div>
          <div>
            {selectedStop !== null ? (
              <div
                className="bg-card p-4 rounded-t-lg md:rounded-lg md:max-w-[400px] animate-in slide-in-from-bottom-full"
                key={selectedStop.stop_id}
              >
                <p className=" text-muted-foreground text-sm mb-2">
                  Selected stop
                </p>
                <StopSearchCard stop={selectedStop} />
                <div className="mt-4 border-t py-4">
                  <Button
                    className="w-full"
                    onClick={() => router.push(`${pathname}?mode=selected`)}
                  >
                    Confirm Selection
                  </Button>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
