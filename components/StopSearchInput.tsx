import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./ui/button";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useLocationStore } from "@/stores/LocationStore";
import { filterStopsByRadius } from "@/lib/utils";
import { Input } from "./ui/input";
import { METER_RADIUS_SEARCH } from "@/lib/constants";

export default function StopSearchInput() {
  const { setFilteredStops, query, setQuery, stops } = useStopSearchStore();

  function handleSearch(query: string) {
    if (query !== "") {
      const newFiltered = stops.filter(
        (st) =>
          st.stop_name.toLowerCase().includes(query.toLowerCase()) ||
          String(st.stop_id).toLowerCase().includes(query.toLowerCase())
      );

      setFilteredStops(newFiltered);
    } else {
      setFilteredStops(filterStopsByRadius(coordinates, stops, METER_RADIUS_SEARCH));
    }
  }

  const { coordinates } = useLocationStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="w-full">
          <Input
            placeholder="Search by stop name"
            className="w-full max-w-full bg-card"
            value={query}
            onChange={(e) =>
              e.target.value == ""
                ? [
                    setFilteredStops(
                      filterStopsByRadius(coordinates, stops, METER_RADIUS_SEARCH)
                    ),
                    setQuery(""),
                  ]
                : setQuery(e.target.value)
            }
            // type="search"
          />
        </div>
        <Button
          size={"icon"}
          onClick={() => handleSearch(query)}
          className="shrink-0"
        >
          <MagnifyingGlassIcon className="shrink-0" />
        </Button>
      </div>
    </div>
  );
}
