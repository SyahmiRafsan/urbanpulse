"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getIconByStopCategory } from "@/lib/utils";
import { useStopSearchStore } from "@/stores/StopSearchStore";

export default function StopTypes({
  stopsSetter,
  recommendationsSetter,
  initialList,
}: {
  stopsSetter?: (stops: Stop[]) => void | null;
  recommendationsSetter?: (recommendations: Recommendation[]) => void | null;
  initialList: (Stop | Recommendation)[];
}) {
  const { filteredStops, initialStops, setInitialStops } = useStopSearchStore();

  // const [initialStops, setInitialStops] = useState(
  //   initialList || []
  // );
  const types = [
    { label: "Bus", value: "bus" },
    { label: "LRT", value: "lrt" },
    { label: "MRT", value: "mrt" },
    { label: "Monorail", value: "mr" },
    // { label: "KTM", value: "ktm" },
  ];

  useEffect(() => {
    if (initialStops.length == 0) {
      setInitialStops(filteredStops);
    }
  }, [filteredStops]);

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
    const stopsWithType = selectedType.includes("all")
      ? initialStops
      : initialStops.filter((stop) =>
          selectedType.includes(stop.category.toLowerCase())
        );

    if (stopsSetter) {
      stopsSetter(stopsWithType as Stop[]);
    } else if (recommendationsSetter) {
      recommendationsSetter(stopsWithType as unknown as Recommendation[]);
    }
  }, [selectedType]);

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
