import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userKey } from "../../global/storageKeys";

// Inlined so this file doesn't depend on the web project's ../mainTypes.
// If you already have userType in an RN mainTypes file, import that instead.
export type userType = {
  username: string;
  backgroundURL: string;
  themeType: "light" | "dark";
  location: { latitude: number; longitude: number };
};

const initialState: userType = {
  username: "",
  backgroundURL: "",
  themeType: "light",
  location: { latitude: 0, longitude: 0 },
};

interface UserStore extends userType {
  updateUser: (name: string, latitude: number, longitude: number) => void;
  updateThemeType: () => void;
  updateBackground: (url: string) => void;
  logOutUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateUser: (name, latitude, longitude) =>
        set(() => ({
          username: name,
          location: { latitude, longitude },
        })),
      updateThemeType: () =>
        set((state) => ({
          themeType: state.themeType === "dark" ? "light" : "dark",
        })),
      updateBackground: (url) => set(() => ({ backgroundURL: url })),
      logOutUser: () => set(initialState),
    }),
    {
      name: userKey,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
