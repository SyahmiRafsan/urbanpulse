import Nav from "@/components/Nav";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import dynamic from "next/dynamic";
import React from "react";

export default function MapPage() {
  const userLocation = {
    lat: 3.1582,
    lon: 101.7122,
  };

  const StopsMap = dynamic(() => import("@/components/StopsMap"), {
    ssr: false,
  });

  return (
    <div className="h-[100svh]">
      <div className="fixed bottom-0 w-full flex flex-row justify-center z-50">
        <Nav />
      </div>
      <StopsMap stops={ALL_STOPS} userLocation={userLocation} />
    </div>
  );
}
