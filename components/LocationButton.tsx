"use client";

import { useState } from "react";
import { SewingPinFilledIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useLocationStore } from "@/stores/LocationStore";
import { Input } from "./ui/input";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { cn } from "@/lib/utils";
import useIsClient from "@/hooks/useIsClient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function LocationButton() {
  const [loading, setLoading] = useState(false);
  const { district, setDistrict, setCoordinates, coordinates } =
    useLocationStore();
  const { setInitialStops, setFilteredStops } = useStopSearchStore();
  const [open, setOpen] = useState(false);
  const getLocation = async () => {
    try {
      setLoading(true);

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setCoordinates(latitude, longitude);
      setInitialStops([]);
      setFilteredStops([]);

      const district = await fetchDistrict(latitude, longitude);
      setDistrict(district);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLoading(false);
    } finally {
      console.log("Done setting user's location");
      setLoading(false);
    }
  };

  const [showCoord, setShowCoord] = useState(false);

  const isClient = useIsClient();

  return (
    <>
      {isClient && (
        <>
          <button
            onClick={
              district
                ? process.env.NODE_ENV == "development"
                  ? !showCoord
                    ? () => setShowCoord(!showCoord)
                    : () => getLocation()
                  : () => getLocation()
                : () => setOpen(true)
            }
            disabled={loading}
            className="flex items-center text-sm text-red-600"
          >
            {district ? (
              <UpdateIcon
                className={cn("mr-1 w-3 h-3", loading ? "animate-spin" : "")}
              />
            ) : (
              <SewingPinFilledIcon className="w-4 h-4" />
            )}
            {!loading ? (
              <p className="font-medium">
                {district ? district : "Set My Location"}
              </p>
            ) : (
              <p className="animate-pulse">Fetching...</p>
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
          <LocationDialog
            open={open}
            setOpen={setOpen}
            handleLocation={getLocation}
          />
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

function LocationDialog({
  open,
  setOpen,
  handleLocation,
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
  handleLocation: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set My Location</DialogTitle>
          <DialogDescription>
            Your location is stored <b>only</b> on your device and is{" "}
            <b>never</b> stored on the server. <br />
            <br />
            To show the location&apos;s district name, the location will be sent{" "}
            <b>only once</b> to the Nominatim{" "}
            <a
              href="https://osmfoundation.org/wiki/Privacy_Policy"
              target="_blank"
              className="underline"
            >
              OpenStreetMap
            </a>{" "}
            Foundation API. <br />
            <br />
            Please read our{" "}
            <a href="/privacy-policy" target="_blank" className="underline">
              privacy policy
            </a>{" "}
            &{" "}
            <a href="/terms-of-service" target="_blank" className="underline">
              terms of service
            </a>{" "}
            for more information.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-4 sm:space-x-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="default" onClick={handleLocation}>
              Set My Location
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
