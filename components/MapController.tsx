"use client";

import { METER_RADIUS_SEARCH } from "@/lib/constants";
import { metersToDegreeChange } from "@/lib/utils";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import L from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export default function MapController({
  userLocation,
  onMapMove,
  stop,
}: {
  userLocation: { lat: number; lon: number };
  onMapMove: (bounds: L.LatLngBounds, zoom: number) => void;
  stop?: Stop;
}) {
  const map = useMap();

  const { filteredStops, isFullscreen } = useStopSearchStore();

  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      onMapMove(bounds, zoom);
    },
    zoomend: (event) => {
      const map = event.target;
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      onMapMove(bounds, zoom);
    },
  });

  useEffect(() => {
    if (stop) {
      //   map.setView([userLocation.lat, userLocation.lon], ); // Adjust the zoom level as needed
      //   map.flyTo([userLocation.lat, userLocation.lon],18)

      const { latChange, lonChange } = metersToDegreeChange(METER_RADIUS_SEARCH, stop.stop_lat); 
      map.fitBounds([
        [stop.stop_lat - latChange, stop.stop_lon - lonChange],
        [stop.stop_lat + latChange, stop.stop_lon + lonChange],
      ]);
    } else if (userLocation) {
      //   map.setView([userLocation.lat, userLocation.lon], ); // Adjust the zoom level as needed
      //   map.flyTo([userLocation.lat, userLocation.lon],18)

      if (
        // isFullscreen &&
        filteredStops &&
        filteredStops.length > 0
      ) {
        const bounds = new L.LatLngBounds([
          [userLocation.lat, userLocation.lon],
        ]);

        filteredStops.forEach((stop) => {
          bounds.extend([stop.stop_lat, stop.stop_lon]);
        });

        map.fitBounds(bounds.pad(0.5));
      } else {
        const { latChange, lonChange } = metersToDegreeChange(
          METER_RADIUS_SEARCH,
          userLocation.lat
        ); 
        map.fitBounds([
          [userLocation.lat - latChange, userLocation.lon - lonChange],
          [userLocation.lat + latChange, userLocation.lon + lonChange],
        ]);
      }
    }

    // TODO fitBounds if click from searched list
  }, [userLocation, stop, map]);

  return null; // This component doesn't render anything by itself
}
