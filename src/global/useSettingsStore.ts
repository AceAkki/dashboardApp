import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { settingsKey } from "./storageKeys";

// App settings that must survive Log Out (the user store is wiped then).
type SettingsStore = {
  haptics: boolean;
  setHaptics: (on: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      haptics: true,
      setHaptics: (haptics) => set({ haptics }),
    }),
    { name: settingsKey, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
