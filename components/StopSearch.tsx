"use client";

import {
  filterStopsByRadius,
  getIconByStopCategory,
  haversineDistance,
} from "@/lib/utils";
import React, { useEffect } from "react";
import { useLocationStore } from "@/stores/LocationStore";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import StopSearchInput from "./StopSearchInput";
import StopTypes from "./StopTypes";
import SearchStopMap from "./StopSearchMap";

export default function StopSearch() {
  // const [filteredStops, setFilteredStops] = useState<Stop[]>(
  //   ALL_STOPS.slice(0, 5)
  // );

  // const [queryText, setQueryText] = useState<string>("");

  const { setFilteredStops, filteredStops, stops, setQuery, setIsFullscreen } =
    useStopSearchStore();

  const { coordinates } = useLocationStore();

  useEffect(() => {
    if (coordinates) {
      setFilteredStops(filterStopsByRadius(coordinates, stops, 500));
    }
  }, []);

  return (
    <>
      <SearchStopMap />
      <div className="p-4">
        <StopSearchInput />
        <div className="mt-4">
          <StopTypes
            stopsSetter={setFilteredStops}
            initialList={filteredStops}
          />
        </div>
      </div>
      <p className="text-muted-foreground px-4">
        Nearby stops ({filteredStops.length})
      </p>
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
                onClick={() => [
                  setQuery(String(st.stop_name)),
                  setIsFullscreen(true),
                ]}
                type="button"
              >
                <img
                  src={getIconByStopCategory(st.category)}
                  className="h-8 w-8"
                />
                <div className="flex flex-col items-start">
                  <p className="font-medium text-sm text-left">
                    {st.stop_name}{" "}
                    <span className="text-muted-foreground font-normal">
                      {st.stop_id}
                    </span>
                  </p>

                  {coordinates && (
                    <p className="text-sm text-muted-foreground">
                      {haversineDistance(coordinates, {
                        lat: st.stop_lat,
                        lon: st.stop_lon,
                      }).toFixed(0)}
                      m
                    </p>
                  )}
                </div>
              </button>
            ))
        ) : (
          <div className="p-4 border-y">No nearby stops found.</div>
        )}
      </div>
    </>
  );
}
