import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./ui/button";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useUserStore } from "@/stores/UserStore";
import { filterStopsByRadius } from "@/lib/utils";

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
      setFilteredStops(filterStopsByRadius(coordinates, stops, 250));
    }
  }

  const { coordinates } = useUserStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="w-full">
          <input
            placeholder="Search by stop name"
            className="bg-input border border-input rounded-md px-2 py-2 w-full max-w-full"
            value={query}
            onChange={(e) =>
              e.target.value == ""
                ? [
                    setFilteredStops(
                      filterStopsByRadius(coordinates, stops, 250)
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
          className="w-10 h-10 shrink-0"
        >
          <MagnifyingGlassIcon className="shrink-0" />
        </Button>
      </div>
    </div>
  );
}
