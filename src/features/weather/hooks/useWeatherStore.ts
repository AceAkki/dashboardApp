import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AQIData, LatLng, WeatherData } from "../weatherType";

// local key so the feature doesn't depend on a shared storageKeys file
export const weatherKey = "weather-storage";

export interface WeatherStore {
  weatherStoreData: WeatherData | null;
  aqiStoreData: AQIData | null;
  /** where the cached data was fetched for - refetch if the user's location changes */
  cachedLocation: LatLng | null;
  /** ms timestamp after which the cache is stale */
  expiresAt: number | null;
  saveWeather: (payload: {
    weather: WeatherData;
    aqi: AQIData;
    location: LatLng;
    expiresAt: number;
  }) => void;
  invalidate: () => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      weatherStoreData: null,
      aqiStoreData: null,
      cachedLocation: null,
      expiresAt: null,
      saveWeather: ({ weather, aqi, location, expiresAt }) =>
        set({
          weatherStoreData: weather,
          aqiStoreData: aqi,
          cachedLocation: location,
          expiresAt,
        }),
      invalidate: () => set({ expiresAt: null }),
    }),
    {
      name: weatherKey,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
