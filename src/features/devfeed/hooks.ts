import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useCachedFetch from "@/global/useCachedFetch";
import { TTL } from "./devConfig";
import {
  fetchDevTo,
  fetchHN,
  fetchLobsters,
  fetchPackageVersions,
  fetchReleases,
  fetchServiceStatuses,
} from "./api";
import type { StorySource } from "./devTypes";

const FETCHERS = { hn: fetchHN, dev: fetchDevTo, lobsters: fetchLobsters } as const;

export const useStories = (source: StorySource) =>
  useCachedFetch(`stories-${source}`, FETCHERS[source], TTL.stories);

export const useServiceStatus = () =>
  useCachedFetch("service-status", fetchServiceStatuses, TTL.status);

export const useReleases = () => useCachedFetch("releases", fetchReleases, TTL.releases);

// ---- package versions + "NEW" marker ----
// The first time a package is seen its version is stored silently. After that, a different version from the stored one is flagged NEW until acknowledged.

const SEEN_KEY = "pkg-seen-versions";

export const usePackageWatch = () => {
  const { data, loading, error, updatedAt, refetch } = useCachedFetch(
    "packages",
    fetchPackageVersions,
    TTL.packages,
  );
  const [seen, setSeen] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY)
      .then((raw) => setSeen(raw ? (JSON.parse(raw) as Record<string, string>) : {}))
      .catch(() => setSeen({}));
  }, []);

  const save = useCallback((next: Record<string, string>) => {
    setSeen(next);
    AsyncStorage.setItem(SEEN_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  // seed versions never seen before
  useEffect(() => {
    if (!data || !seen) return;
    const missing = data.filter((p) => p.version && !seen[p.name]);
    if (missing.length === 0) return;
    const next = { ...seen };
    missing.forEach((p) => {
      next[p.name] = p.version as string;
    });
    save(next);
  }, [data, seen, save]);

  const rows = (data ?? []).map((p) => ({
    ...p,
    isNew: !!p.version && !!seen?.[p.name] && seen[p.name] !== p.version,
  }));

  const acknowledge = useCallback(() => {
    if (!data || !seen) return;
    const next = { ...seen };
    data.forEach((p) => {
      if (p.version) next[p.name] = p.version;
    });
    save(next);
  }, [data, seen, save]);

  return { rows, loading, error, updatedAt, refetch, acknowledge };
};
