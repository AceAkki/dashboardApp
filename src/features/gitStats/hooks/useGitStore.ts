import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { GitUser, GitRepository, GitStats } from "../gitTypes";

// local key so the feature doesn't depend on a shared storageKeys file
export const gitKey = "git-storage";

export interface GitStore {
  gitStatData: GitStats | null;
  /** ms timestamp after which the cache is stale */
  expiresAt: number | null;
  saveGitStats: (payload: { gitStatData: GitStats; expiresAt: number }) => void;
  invalidate: () => void;
}

export const useGitStore = create<GitStore>()(
  persist(
    (set) => ({
      gitStatData: null,
      expiresAt: null,
      saveGitStats: ({ gitStatData, expiresAt }) =>
        set({
          gitStatData: gitStatData,
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
