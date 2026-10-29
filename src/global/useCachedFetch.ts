import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Entry<T> = { at: number; data: T };

const PREFIX = "cache:";

export const getJSON = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
};

// Fetch with a disk cache.
//  - fresh cache (younger than ttlMs): used, no request is made
//  - stale cache: shown immediately while a new request runs
//  - request fails: the stale cache stays on screen and `error` is set
//
// `fetcher` must be a stable function (declared outside the component).
export default function useCachedFetch<T>(
  key: string,
  fetcher: (signal?: AbortSignal) => Promise<T>,
  ttlMs: number,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const load = useCallback(
    async (force: boolean, signal?: AbortSignal) => {
      let cached: Entry<T> | null = null;
      try {
        const raw = await AsyncStorage.getItem(PREFIX + key);
        if (raw) cached = JSON.parse(raw) as Entry<T>;
      } catch {
        cached = null;
      }
      if (signal?.aborted) return;
      if (cached) {
        setData(cached.data);
        setUpdatedAt(cached.at);
      }
      if (!force && cached && Date.now() - cached.at < ttlMs) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fresh = await fetcher(signal);
        const at = Date.now();
        setData(fresh);
        setUpdatedAt(at);
        setError(null);
        AsyncStorage.setItem(PREFIX + key, JSON.stringify({ at, data: fresh })).catch(() => {});
      } catch (e) {
        if (signal?.aborted) return;
        setError(cached ? "OFFLINE - SHOWING SAVED DATA" : "SOURCE UNAVAILABLE");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [key, fetcher, ttlMs],
  );

  useEffect(() => {
    const ctrl = new AbortController();
    load(false, ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const refetch = useCallback(() => load(true), [load]);

  return { data, loading, error, updatedAt, refetch };
}
