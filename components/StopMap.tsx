"use client";

import React from "react";
import StopsMap from "./StopsMap";
import { ALL_STOPS } from "@/lib/stops/all_stops";

export default function StopMap({ stop }: { stop: Stop }) {
  return (
    <StopsMap
      stops={ALL_STOPS}
      userLocation={{
        lat: 3.1582,
        lon: 101.7122,
      }}
      stop={stop}
    />
  );
}
