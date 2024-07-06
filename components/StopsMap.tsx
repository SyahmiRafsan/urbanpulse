"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapController from "./MapController";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import slugify from "slugify";
import { getIconByStopCategory } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useStopSearchStore } from "@/stores/StopSearchStore";

export default function StopsMap({
  stops,
  userLocation,
  stop,
}: {
  stops: Stop[];
  userLocation: { lat: number; lon: number };
  stop?: Stop;
}) {
  // Define category colors
  const categoryColors: Record<Category, string> = {
    lrt: "lrt",
    mrt: "mrt",
    mr: "mr",
    bus: "bus",
    // Add more categories as needed
  };

  // Create a custom icon based on category
  const getCategoryIcon = (category: Category) => {
    return new L.Icon({
      iconUrl: `/icons/${categoryColors[category]}.svg`,
      // iconUrl: "/icons/bus.svg",
      iconSize: [20, 20],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const getCategoryIconBig = (category: Category) => {
    return new L.Icon({
      // iconUrl: `/icons/${categoryColors[category]}.svg`,
      iconUrl: `/icons/location_dot.svg`,
      // iconUrl: "/icons/bus.svg",
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: "",
    });
  };

  const [stopsShown, setStopsShown] = useState<Stop[]>([]);

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { filteredStops, isFullscreen, query } = useStopSearchStore();

  const handleMapMove = async (bounds: L.LatLngBounds, zoom: number) => {
    const moveFilteredStops = filterStopsByBounds(stops, bounds);
    // const fetchedStopsData = await fetchStopsData(bounds, zoom);
    if (stop) {
      setStopsShown(
        moveFilteredStops.filter((st) => st.stop_id !== stop.stop_id)
      );
    } else {
      if (mode !== "searching") {
        setStopsShown(moveFilteredStops);
      }

      if (mode == "searching" && isFullscreen && query =="") {
        setStopsShown(moveFilteredStops);
      }
    }
    console.log("rerendered");
    console.log({ bounds, zoom });
  };

  useEffect(() => {
    setStopsShown(filteredStops);
  }, [filteredStops]);

  // Filter stops based on bounds and zoom level
  const filterStopsByBounds = (allStops: Stop[], bounds: L.LatLngBounds) => {
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    const southWestLat = southWest.lat;
    const southWestLon = southWest.lng;
    const northEastLat = northEast.lat;
    const northEastLon = northEast.lng;

    return allStops.filter((stop) => {
      const { stop_lat, stop_lon } = stop;
      return (
        stop_lat >= southWestLat &&
        stop_lat <= northEastLat &&
        stop_lon >= southWestLon &&
        stop_lon <= northEastLon
      );
    });
  };

  const fetchStopsData = async (bounds: L.LatLngBounds, zoom: number) => {
    // Adjust API endpoint or query based on zoom level
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    // Get the lat/lon coordinates for the bounds
    const southWestLat = southWest.lat;
    const southWestLon = southWest.lng;
    const northEastLat = northEast.lat;
    const northEastLon = northEast.lng;

    console.log({ southWest, northEast });

    // Example API call to get stops data within the bounds and zoom level
    // const response = await fetch(
    //   `/api/stops?neLat=${northEastLat}&neLon=${northEastLon}&swLat=${southWestLat}&swLon=${southWestLon}&zoom=${zoom}`
    // );
    // if (!response.ok) {
    //   throw new Error("Failed to fetch stops data");
    // }
    // const data = await response.json();
    // return data;
  };

  function stopMarker(stop: Stop) {
    return (
      <Marker
        position={[stop.stop_lat, stop.stop_lon]}
        icon={getCategoryIconBig(stop.category.toLocaleLowerCase() as Category)}
        // eventHandlers={{
        //   click: () => alert(stop.stop_name),
        // }}
        zIndexOffset={50}
      >
        <Popup className="">
          <div className="flex flex-row gap-2 items-center">
            <img src={getIconByStopCategory(stop.category)} />
            <b>{stop.stop_name}</b>
          </div>
        </Popup>
      </Marker>
    );
  }

  return (
    <MapContainer
      center={
        stop
          ? [stop.stop_lat, stop.stop_lon]
          : [userLocation.lat, userLocation.lon]
      }
      // zoom={18}
      minZoom={10}
      maxZoom={18}
      // style={{ height: "100%", width: "100%" }}
      className="w-[100%] h-[100%] z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController
        userLocation={userLocation}
        onMapMove={handleMapMove}
        stop={stop}
      />

      {stopsShown.map((stop, idx) => (
        <Marker
          key={idx}
          position={[stop.stop_lat, stop.stop_lon]}
          icon={
            query !== "" &&
            (stop.stop_name.toLowerCase().includes(query.toLowerCase()) ||
              String(stop.stop_id).toLowerCase().includes(query.toLowerCase()))
              ? getCategoryIconBig(
                  stop.category.toLocaleLowerCase() as Category
                )
              : getCategoryIcon(stop.category.toLocaleLowerCase() as Category)
          }
          // eventHandlers={{
          //   click: () => alert(stop.stop_name),
          // }}
        >
          {/* // If using popup */}
          <Popup className="">
            <div>
              <div className="flex flex-row gap-1 items-center">
                <img src={getIconByStopCategory(stop.category)} />
                <b className="pr-2 whitespace-nowrap">{stop.stop_name}</b>
              </div>
              {mode !== "searching" ? (
                <Link
                  href={`/${stop.category}/${slugify(stop.stop_name, {
                    lower: true,
                    strict: true,
                  })}-${stop.stop_id}`}
                >
                  <Badge variant={"default"} className="mt-2">
                    View
                  </Badge>
                </Link>
              ) : (
                <Badge className="mt-1">Select Stop</Badge>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {stop && stopMarker(stop)}

      <Marker
        position={[userLocation.lat, userLocation.lon]}
        icon={
          new L.DivIcon({
            // iconUrl: "https://example.com/icon/user.png", // Provide your user location icon URL or path
            // iconUrl: "/icons/person.svg",
            html: `
              <div class="bg-blue-600 border-2 shadow-sm border-white rounded-full w-6 h-6 flex items-center justify-center">
               
              </div>`,
            iconSize: [25, 25],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "",
          })
        }
      >
        <Popup>
          <b>Your Location</b>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
