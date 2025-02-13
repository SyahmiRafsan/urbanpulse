"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getClosestStops, getIconByStopCategory } from "@/lib/utils";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import { useLocationStore } from "@/stores/LocationStore";
import { METER_RADIUS_SEARCH } from "@/lib/constants";

export default function StopTypes({
  stopsSetter,
  recommendationsSetter,
  initialList,
}: {
  stopsSetter?: (stops: Stop[]) => void | null;
  recommendationsSetter?: (recommendations: Recommendation[]) => void | null;
  initialList: (Stop | Recommendation)[];
}) {
  const {
    setFilteredStops,
    filteredStops,
    initialStops,
    setInitialStops,
    stops,
  } = useStopSearchStore();
  const { sortType } = useRecommendationStore();

  const { coordinates } = useLocationStore();
  const types = [
    { label: "Bus", value: "bus" },
    { label: "LRT", value: "lrt" },
    { label: "MRT", value: "mrt" },
    { label: "Monorail", value: "mr" },
    // { label: "KTM", value: "ktm" },
  ];

  // const [initialCoordinates, setInitialCoordinates] =
  //   useState<Coordinate>(null);

  useEffect(() => {
    // TODO refactor to differentiate setters vs setFilteredStops

    // if (filteredStops.length == 0 && coordinates) {

    if (coordinates) {
      const closestStops = getClosestStops(
        coordinates,
        stops,
        METER_RADIUS_SEARCH
      );
      setFilteredStops(closestStops);
      setInitialStops(closestStops);
      console.log("Received closestStops", closestStops.length);
    }
    console.log("Resetting stops");
    // }
  }, [coordinates]);

  const [selectedType, setSelectedType] = useState(["all"]);

  const handleModeChange = (mode: string) => {
    setSelectedType((prevModes) => {
      if (mode == "all") {
        return ["all"];
      } else {
        if (prevModes.includes(mode)) {
          if (prevModes.length > 1) {
            return prevModes.filter((m) => m !== mode);
          } else {
            return ["all"];
          }
        } else {
          return [...prevModes.filter((m) => m !== "all"), mode];
        }
      }
    });
  };

  useEffect(() => {
    if (stopsSetter) {
      const stopsWithType = selectedType.includes("all")
        ? initialStops
        : initialStops.filter((stop) =>
            selectedType.includes(stop.category.toLowerCase())
          );
      stopsSetter(stopsWithType as Stop[]);
    }

    if (recommendationsSetter) {
      const stopsWithType = selectedType.includes("all")
        ? initialList
        : initialList.filter((stop) =>
            selectedType.includes(stop.category.toLowerCase())
          );
      recommendationsSetter(stopsWithType as unknown as Recommendation[]);
    }
  }, [selectedType]);

  useEffect(() => {
    setSelectedType(["all"]);
  }, [sortType]);

  return (
    <div className="flex flex-row gap-2 items-center overflow-x-auto">
      <Button
        className="rounded-full"
        size={"sm"}
        variant={selectedType[0] == "all" ? "default" : "outline"}
        onClick={() => handleModeChange("all")}
      >
        <p className="whitespace-nowrap">All Stops</p>
      </Button>
      {types.map((type, i) => (
        <Button
          key={type.label + i}
          className="rounded-full px-5"
          variant={selectedType.includes(type.value) ? "default" : "outline"}
          size={"sm"}
          onClick={() => handleModeChange(type.value)}
        >
          <img
            src={getIconByStopCategory(type.value as Category)}
            className="w-5 h-5 mr-1 rounded-sm"
          />
          <p className="">{type.label}</p>
        </Button>
      ))}
    </div>
  );
}
