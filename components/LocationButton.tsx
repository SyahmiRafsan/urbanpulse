"use client";

import { useEffect, useState } from "react";
import { DrawingPinIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useLocationStore } from "@/stores/LocationStore";
import { Input } from "./ui/input";

export default function LocationButton() {
  const [loading, setLoading] = useState(false);
  const { district, setDistrict, setCoordinates, coordinates } =
    useLocationStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true);

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      setCoordinates(latitude, longitude);

      const district = await fetchDistrict(latitude, longitude);
      setDistrict(district);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const [showCoord, setShowCoord] = useState(false);

  return (
    <>
      {isClient && (
        <>
          <button
            onClick={
              district
                ? () =>
                    process.env.NODE_ENV == "development"
                      ? setShowCoord(!showCoord)
                      : null
                : handleClick
            }
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
          {showCoord && (
            <div className="w-fit flex-row flex gap-1 ml-1">
              <Input
                step={0.0001}
                value={coordinates.lat.toFixed(4)}
                onChange={(e) =>
                  setCoordinates(Number(e.target.value), coordinates.lon)
                }
                type="number"
              />
              <Input
                step={0.0001}
                value={coordinates.lon.toFixed(4)}
                onChange={(e) =>
                  setCoordinates(coordinates.lat, Number(e.target.value))
                }
                type="number"
              />
            </div>
          )}
        </>
      )}
    </>
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
