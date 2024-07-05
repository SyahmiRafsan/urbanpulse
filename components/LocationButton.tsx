"use client";

import { useState } from "react";
import { DrawingPinIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useUserStore } from "@/stores/UserStore";

export default function LocationButton() {
  const [loading, setLoading] = useState(false);
  const { district, setDistrict, setCoordinates, coordinates } = useUserStore();

  const handleClick = async () => {
    try {
      setLoading(true);

      if (!coordinates?.lat && !coordinates?.lon) {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        setCoordinates(latitude, longitude);

        const district = await fetchDistrict(latitude, longitude);
        setDistrict(district);
      } else {
        const district = await fetchDistrict(coordinates.lat, coordinates.lon);
        setDistrict(district);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex gap-1 items-center text-muted-foreground text-sm"
    >
      <DrawingPinIcon className="w-5 h-5" />
      {district ? (
        <p>{district}</p>
      ) : (
        <p>{loading ? "Fetching..." : "Get Location"}</p>
      )}
    </button>
  );
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: Infinity,
    });
  });
}

async function fetchDistrict(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `/api/reverse?lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();

    if (data.district) {
      return data.district || "Unknown";
    } else if (data.suburb) {
      return data.suburb || "Unknown";
    } else if (data.road) {
      return data.road || "Unknown";
    } else {
      return "Unknown";
    }
  } catch (error) {
    console.error("Error fetching district:", error);
    return "Unknown";
  }
}
