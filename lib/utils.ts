import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { METER_RADIUS_SEARCH } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts distance in meters to a degree change in latitude or longitude
export function metersToDegreeChange(
  meters: number,
  latitude: number
): { latChange: number; lonChange: number } {
  // 1 degree of latitude is approximately 111,139 meters
  const metersPerDegreeLat = 111139;

  // Calculate the degree change for latitude
  const latChange = meters / metersPerDegreeLat;

  // Calculate the degree change for longitude
  // At a given latitude, the distance per degree of longitude is scaled by the cosine of latitude
  const metersPerDegreeLon = 111139 * Math.cos((latitude * Math.PI) / 180);
  const lonChange = meters / metersPerDegreeLon;

  return { latChange, lonChange };
}

// TODO category as Category below
export function getIconByStopCategory(category: string) {
  const imgUrl = `/icons/${category.toLowerCase()}.svg`;
  return imgUrl;
}

/**
 * Truncates a string to a specified length and appends "..." if the string exceeds the length.
 *
 * @param str - The string to be truncated.
 * @param maxLength - The maximum length of the string including the "..." characters.
 * @returns The truncated string with "..." if it was longer than the maxLength.
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3).trimEnd() + "...";
}

interface Coordinates {
  lat: number;
  lon: number;
}

export function haversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371e3; // Radius of the Earth in meters
  const lat1 = toRadians(coord1.lat);
  const lon1 = toRadians(coord1.lon);
  const lat2 = toRadians(coord2.lat);
  const lon2 = toRadians(coord2.lon);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

export function filterStopsByRadius(
  userCoordinates: Coordinates,
  stops: Stop[],
  radiusInMeters: number = METER_RADIUS_SEARCH
): Stop[] {
  return stops.filter((stop) => {
    const stopCoordinates: Coordinates = {
      lat: stop.stop_lat,
      lon: stop.stop_lon,
    };
    const distance = haversineDistance(userCoordinates, stopCoordinates);
    return distance <= radiusInMeters;
  });
}

/**
 * Converts a number to a string with 'k' suffix for thousands.
 *
 * @param num - The number to be converted.
 * @returns A string representing the number with 'k' suffix if applicable.
 */
export function formatThousands(num: number): string {
  if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    // Remove trailing .0 if it's a whole number
    return formattedNum.endsWith(".0")
      ? formattedNum.slice(0, -2) + "k"
      : formattedNum + "k";
  } else {
    const formattedNum = num.toFixed(0);

    return formattedNum;
  }
  // return num.toString();
}

// Example usage:
console.log(formatThousands(1500)); // "1.5k"
console.log(formatThousands(999)); // "999"
console.log(formatThousands(10000)); // "10k"
