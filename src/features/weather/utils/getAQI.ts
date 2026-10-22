import type { objUSAQI, AQILevel } from "../weatherType";

export const USAQI: objUSAQI = {
  good: [0, 50],
  moderate: [51, 100],
  sensitive: [101, 150],
  // was [101, 200] on web, which overlapped "sensitive"
  unhealthy: [151, 200],
  severe: [201, 300],
  hazardous: [301, 500],
};

export const getAQILevel = (aqiValue: number, object: objUSAQI): string => {
  const level = (Object.keys(object) as AQILevel[]).find(
    (key) => object[key][0] <= aqiValue && object[key][1] >= aqiValue,
  );
  return level ?? "unknown";
};

// replaces the web project's String.prototype.toSentenceCase extension
export const toSentenceCase = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
