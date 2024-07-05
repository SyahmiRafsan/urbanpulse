"use client";

import {
  filterStopsByRadius,
  getIconByStopCategory,
  haversineDistance,
} from "@/lib/utils";
import React, { useEffect } from "react";
import { useUserStore } from "@/stores/UserStore";
import SelectStopMap from "./SelectStopMap";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import StopSearchInput from "./StopSearchInput";

export default function StopSearch() {
  // const [filteredStops, setFilteredStops] = useState<Stop[]>(
  //   ALL_STOPS.slice(0, 5)
  // );

  // const [queryText, setQueryText] = useState<string>("");

  const { setFilteredStops, filteredStops, stops, setQuery, setIsFullscreen } =
    useStopSearchStore();

  const { coordinates } = useUserStore();

  useEffect(() => {
    if (coordinates) {
      if (coordinates && coordinates.lat !== null && coordinates.lon !== null) {
        setFilteredStops(filterStopsByRadius(coordinates, stops, 250));
      }
    }
  }, []);

  return (
    <>
      <SelectStopMap />
      <div className="p-4">
        <StopSearchInput />
      </div>
      <p className="text-muted-foreground px-4">
        Nearby stops ({filteredStops.length})
      </p>
      <div>
        {filteredStops
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
              className="p-4 first:border-t mt-4 border-b flex flex-row gap-2 items-center w-full"
              onClick={() => [
                setQuery(String(st.stop_id)),
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
                  {st.stop_name} [{st.stop_id}]
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
          ))}
      </div>
    </>
  );
}
