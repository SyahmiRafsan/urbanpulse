import { NextRequest } from "next/server";
import * as fs from "fs";

// A helper function to parse CSV line with quoted values
function parseCsvLine(line: string) {
  const regex = /(?:,|\n)(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
  const result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    result.push(line.slice(lastIndex, match.index));
    lastIndex = match.index + 1;
  }
  result.push(line.slice(lastIndex));

  return result.map(item => {
    if (item.startsWith('"') && item.endsWith('"')) {
      return item.slice(1, -1).replace(/""/g, '"'); // Remove surrounding quotes and escape double quotes
    }
    return item;
  });
}

function convertTxtToJson(filePath: string): string {
  // Read the content of the file
  const content = fs.readFileSync(filePath, "utf-8");

  // Split the content by new lines
  const lines = content.split("\n").filter((line) => line.trim() !== ""); // Remove empty lines

  if (lines.length === 0) {
    throw new Error("File is empty or has only empty lines");
  }

  // Extract the header
  const header = parseCsvLine(lines[0]).map(column => column.replace(/\r/g, '')); // Remove \r from header fields

  // Extract the rows
  const rows = lines.slice(1);

  // Create an array to hold the JSON objects
  const jsonArray = rows.map((row) => {
    const values = parseCsvLine(row);
    const jsonObject: { [key: string]: string | number | boolean | null } = {};

    header.forEach((key, index) => {
      let value: string | number | boolean | null = values[index] || null;

      // Remove \r from values
      if (typeof value === 'string') {
        value = value.replace(/\r/g, '');
      }

      // Parse values to appropriate types
      if (value !== null) {
        if (!isNaN(Number(value))) {
          value = Number(value);
        } else if (
          value.toLowerCase() === "true" ||
          value.toLowerCase() === "false"
        ) {
          value = value.toLowerCase() === "true";
        }
      }

      jsonObject[key] = value;
    });

    return jsonObject;
  });

  // Convert the JSON array to a string
  return JSON.stringify(jsonArray, null, 2);
}

// If you want to save the JSON result to a file, you can use the following line:
// fs.writeFileSync('output.json', jsonResult, 'utf-8');

export async function GET(req: NextRequest) {
  // Example usage:
  // Please change filePath if you want to convert different txt files to JSON
  const filePath = "public/txt/rapid_bus_kl_stops.txt";
  const jsonResult = convertTxtToJson(filePath);

  return Response.json(JSON.parse(jsonResult));
}
