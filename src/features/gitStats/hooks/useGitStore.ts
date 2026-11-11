import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { GitUser, GitRepository, GitStats } from "../gitTypes";

// local key so the feature doesn't depend on a shared storageKeys file
export const gitKey = "git-storage";

export interface GitStore {
  gitStatData: GitStats | null;
  /** ms timestamp after which the cache is stale */
  fetchedAt: number | null;
  expiresAt: number | null;
  saveGitStats: (payload: { gitStatData: GitStats;fetchedAt:number, expiresAt: number }) => void;
  invalidate: () => void;
}

export const useGitStore = create<GitStore>()(
  persist(
    (set) => ({
      gitStatData: null,
      fetchedAt:null,
      expiresAt: null,
      saveGitStats: ({ gitStatData, fetchedAt, expiresAt }) =>
        set({
          gitStatData: gitStatData,
          fetchedAt,
          expiresAt,
        }),
      invalidate: () => set({ expiresAt: null }),
    }),
    {
      name: gitKey,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
