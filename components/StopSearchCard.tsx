"use client";

import {
  formatThousands,
  getCategoryWithoutBus,
  getIconByStopCategory,
  haversineDistance,
} from "@/lib/utils";
import { useLocationStore } from "@/stores/LocationStore";
import React from "react";

export default function StopSearchCard({ stop }: { stop: Stop }) {
  const { coordinates } = useLocationStore();

  return (
    <div className="flex flex-row items-center gap-2">
      <img src={getIconByStopCategory(stop.category)} className="h-8 w-8" />
      <div className="flex flex-col items-start">
        <p className="font-medium text-sm text-left">
          {getCategoryWithoutBus(stop.category.toLocaleUpperCase())}{" "}
          {stop.stop_name}{" "}
          <span className="text-muted-foreground text-xs font-normal">
            {stop.stop_id}
          </span>
        </p>

        {coordinates && (
          <p className="text-sm text-muted-foreground">
            {formatThousands(
              haversineDistance(coordinates, {
                lat: stop.stop_lat,
                lon: stop.stop_lon,
              })
            )}
            m
          </p>
        )}
      </div>
    </div>
  );
}
