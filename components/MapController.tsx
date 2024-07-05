"use client"

import { metersToDegreeChange } from "@/lib/utils";
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

      const { latChange, lonChange } = metersToDegreeChange(100, stop.stop_lat); // For a 100m radius
      map.fitBounds([
        [stop.stop_lat - latChange, stop.stop_lon - lonChange],
        [stop.stop_lat + latChange, stop.stop_lon + lonChange],
      ]);
    } else if (userLocation) {
      //   map.setView([userLocation.lat, userLocation.lon], ); // Adjust the zoom level as needed
      //   map.flyTo([userLocation.lat, userLocation.lon],18)

      const { latChange, lonChange } = metersToDegreeChange(
        250,
        userLocation.lat
      ); // For a 250m radius
      map.fitBounds([
        [userLocation.lat - latChange, userLocation.lon - lonChange],
        [userLocation.lat + latChange, userLocation.lon + lonChange],
      ]);
    }

    // TODO fitBounds if click from searched list
    
  }, [userLocation, stop, map]);

  return null; // This component doesn't render anything by itself
}
