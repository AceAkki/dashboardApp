import { useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { fetchData, dateFormat } from "@/global/globalFunctions";
import type { GitRepository, GitUser, GitStats, GitStatRes } from "../gitTypes";
import { useUserStore } from "../../auth/useAuthStore";
import { useGitStore } from "./useGitStore";

const CACHE_MS = 15 * 60 * 1000;

export const useGitStats = (): GitStatRes => {
  const { userID } = useUserStore(useShallow((s) => ({ userID: s.userID })));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { gitStatData, expiresAt, saveGitStats, invalidate } = useGitStore(
    useShallow((s) => ({
      gitStatData: s.gitStatData,
      expiresAt: s.expiresAt,
      saveGitStats: s.saveGitStats,
      invalidate: s.invalidate,
    })),
  );

  // wait for AsyncStorage to load the cache before deciding to fetch
  const [hydrated, setHydrated] = useState(useGitStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useGitStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useGitStore.persist.hasHydrated());
    return unsub;
  }, []);

  const fresh =
    gitStatData !== null && expiresAt !== null && expiresAt > Date.now();

  useEffect(() => {
    if (!hydrated || fresh) return;

    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([getGitData(userID)])
      .then(([gitNewData]) => {
        if (!active) return;
        if (!gitNewData) {
          setError("Couldn't load userID. Check your connection.");
          return;
        }
        saveGitStats({
          gitStatData: gitNewData,
          fetchedAt: Date.now(),
          expiresAt: Date.now() + CACHE_MS,
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userID, hydrated, fresh]);

  return {
    data: gitStatData,
    loading,
    error,
    storageTime: expiresAt,
    refetch: invalidate,
  };
};

export const getGitData = async (userid: string): Promise<GitStats | null> => {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(userid)}`,
      {
        headers: {
          "User-Agent": "dashApp",
        },
      },
    );
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    let userData: GitUser = await res.json();
    let reposDataArr = (await fetchData(userData.repos_url)) as GitRepository[];
    if (!reposDataArr) return null;
    let lastPushedRepo = reposDataArr
      .filter((repo) => Boolean(repo.pushed_at))
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))[0];
    let lastPushDate = dateFormat(lastPushedRepo.pushed_at);

    return {
      ...userData,
      lastPushedRepo: lastPushedRepo,
      lastPushDate: lastPushDate,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
