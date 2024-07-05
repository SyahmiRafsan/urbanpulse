import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const imgUrl = `/icons/${category}.svg`;
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
