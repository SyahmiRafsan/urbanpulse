"use client";

import Nav from "@/components/Nav";
import StopSearchInput from "@/components/StopSearchInput";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import { useLocationStore } from "@/stores/LocationStore";
import dynamic from "next/dynamic";
import React from "react";

export default function MapPage() {
  const { coordinates } = useLocationStore();
  const StopsMap = dynamic(() => import("@/components/StopsMap"), {
    ssr: false,
  });

  return (
    <div className="h-[100svh]">
      <div className="fixed bottom-0 w-full flex flex-row justify-center z-50">
        <Nav />
      </div>
      <StopsMap stops={ALL_STOPS} userLocation={coordinates} />
      <div className="fixed bottom-16 sm:bottom-24 md w-full max-w-[400px] m-auto inset-x-0 p-4">
        <StopSearchInput />
      </div>
    </div>
  );
}
