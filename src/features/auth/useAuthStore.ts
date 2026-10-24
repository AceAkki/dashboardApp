import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userKey } from "../../global/storageKeys";

export type userType = {
  username: string;
  userID: string;
  backgroundURL: string;
  themeType: "light" | "dark";
  location: { latitude: number; longitude: number };
};

const initialState: userType = {
  username: "",
  userID: "",
  backgroundURL: "",
  themeType: "light",
  location: { latitude: 0, longitude: 0 },
};

interface UserStore extends userType {
  updateUser: (
    name: string,
    latitude: number,
    longitude: number,
    userID: string,
  ) => void;
  updateThemeType: () => void;
  updateBackground: (url: string) => void;
  logOutUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateUser: (name, latitude, longitude, userID) =>
        set(() => ({
          username: name,
          location: { latitude, longitude },
          userID: userID,
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
