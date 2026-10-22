import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useUserStore } from "../../auth/useAuthStore";
import { useWeatherStore } from "./useWeatherStore";
import { getAQI, getWeather } from "../utils/getWeather";

// cache lifetime, same 2 hours as the web version
const CACHE_MS = 2 * 60 * 60 * 1000;

const sameSpot = (
  a: { latitude: number; longitude: number } | null,
  b: { latitude: number; longitude: number },
) => !!a && a.latitude === b.latitude && a.longitude === b.longitude;

/**
 * Replaces react-query + the two-store dance on web: the persisted store IS the
 * cache. Fresh cache for this location -> use it, otherwise fetch and save.
 */
const useFetchWeatherData = () => {
  const location = useUserStore(useShallow((s) => s.location));
  const { weatherStoreData, aqiStoreData, cachedLocation, expiresAt, saveWeather, invalidate } =
    useWeatherStore(
      useShallow((s) => ({
        weatherStoreData: s.weatherStoreData,
        aqiStoreData: s.aqiStoreData,
        cachedLocation: s.cachedLocation,
        expiresAt: s.expiresAt,
        saveWeather: s.saveWeather,
        invalidate: s.invalidate,
      })),
    );

  // wait for AsyncStorage to load the cache before deciding to fetch
  const [hydrated, setHydrated] = useState(useWeatherStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useWeatherStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useWeatherStore.persist.hasHydrated());
    return unsub;
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheMatches = sameSpot(cachedLocation, location);
  const fresh =
    weatherStoreData !== null &&
    aqiStoreData !== null &&
    expiresAt !== null &&
    expiresAt > Date.now() &&
    cacheMatches;

  // 0,0 is the store's "not set yet" value
  const hasLocation = !(location.latitude === 0 && location.longitude === 0);

  useEffect(() => {
    if (!hydrated || fresh || !hasLocation) return;

    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([getWeather(location), getAQI(location)])
      .then(([weather, aqi]) => {
        if (!active) return;
        if (!weather || !aqi) {
          setError("Couldn't load weather. Check your connection.");
          return;
        }
        saveWeather({
          weather,
          aqi,
          location: { latitude: location.latitude, longitude: location.longitude },
          expiresAt: Date.now() + CACHE_MS,
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, fresh, hasLocation, location.latitude, location.longitude]);

  return {
    // never show data cached for a different location
    weatherData: cacheMatches ? weatherStoreData : null,
    aqiData: cacheMatches ? aqiStoreData : null,
    loading: loading || !hydrated,
    error,
    storageTime: expiresAt,
    // force a refetch (pull-to-refresh)
    refetch: invalidate,
  };
};

export default useFetchWeatherData;
