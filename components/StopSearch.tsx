"use client";

import {
  haversineDistance,
} from "@/lib/utils";
import React, { useEffect } from "react";
import { useLocationStore } from "@/stores/LocationStore";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import StopSearchInput from "./StopSearchInput";
import StopTypes from "./StopTypes";
import SearchStopMap from "./StopSearchMap";
import StopSearchCard from "./StopSearchCard";
import LocationButton from "./LocationButton";

export default function StopSearch() {
  // const [filteredStops, setFilteredStops] = useState<Stop[]>(
  //   ALL_STOPS.slice(0, 5)
  // );

  // const [queryText, setQueryText] = useState<string>("");

  const {
    setFilteredStops,
    filteredStops,

    setQuery,
    setIsFullscreen,
    setSelectedStop,
  } = useStopSearchStore();

  const { coordinates } = useLocationStore();

  function handleCardClick(stop: Stop) {
    setQuery(String(stop.stop_name));
    setIsFullscreen(true);
    setSelectedStop(stop);
  }

  return (
    <>
      <SearchStopMap />
      <div className="p-4">
        <StopSearchInput />
      </div>
      <div className="flex flex-row gap-2 items-center overflow-x-auto mb-4">
        <div className="px-4">
          <StopTypes
            stopsSetter={setFilteredStops}
            initialList={filteredStops}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center justify-between  px-4">
        <p className="text-muted-foreground">
          Nearby stops ({filteredStops.length})
        </p>
        <LocationButton />
      </div>
      <div className="mt-4">
        {filteredStops.length > 0 ? (
          filteredStops
            .sort((a, b) =>
              coordinates
                ? haversineDistance(coordinates, {
                    lat: a.stop_lat,
                    lon: a.stop_lon,
                  }) -
                  haversineDistance(coordinates, {
                    lat: b.stop_lat,
                    lon: b.stop_lon,
                  })
                : a.stop_lat - b.stop_lat
            )
            .map((st) => (
              <button
                key={st.stop_id}
                className="p-4 first:border-t border-b flex flex-row gap-2 items-center w-full animate-in z-10 slide-in-from-left-4"
                onClick={() => handleCardClick(st)}
                type="button"
              >
                <StopSearchCard stop={st} />
              </button>
            ))
        ) : (
          <div className="p-4 border-y">No nearby stops found.</div>
        )}
      </div>
    </>
  );
}
