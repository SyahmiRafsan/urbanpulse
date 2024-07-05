"use client";

import Nav from "@/components/Nav";
import StopsMap from "@/components/StopsMap";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import React from "react";

export default function MapPage() {
  const userLocation = {
    lat: 3.1582,
    lon: 101.7122,
  };

  return (
    <div className="h-[100svh]">
      <div className="fixed bottom-0 z-50 w-full flex flex-row justify-center">
        <Nav />
      </div>
      <StopsMap stops={ALL_STOPS} userLocation={userLocation} />
    </div>
  );
}