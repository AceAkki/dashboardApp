import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";


import {defaultBootKey} from "@/global/bootMap";
import {DAY} from "@/global/backup";
import { userKey } from "../../global/storageKeys";

export type userType = {
  username: string;
  userID: string;
  backgroundURL: string;
  BootOption: string;
  themeType: "light" | "dark";
  location: { latitude: number; longitude: number };
  lastBackup:string;
  backupEvery:number;
  rewindEvery:number;
};

const initialState: userType = {
  username: "",
  userID: "",
  backgroundURL: "",
  BootOption:defaultBootKey,
  themeType: "light",
  location: { latitude: 0, longitude: 0 },
  lastBackup: "",
  backupEvery: 7 * DAY,
  rewindEvery: DAY,
};

interface UserStore extends userType {
  updateUser: (
    name: string,
    latitude: number,
    longitude: number,
    userID: string,
  ) => void;
  updateBootOption: (option:string) => void;
  updateThemeType: () => void;
  updateBackground: (url: string) => void;
  logOutUser: () => void;
  updateLastBackup: (dateString:string) => void;
  updateBackupEvery:(day:number) => void;
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
      updateBootOption: (option) => set(()=> ({BootOption:option})),
      updateThemeType: () =>
        set((state) => ({
          themeType: state.themeType === "dark" ? "light" : "dark",
        })),
      updateBackground: (url) => set(() => ({ backgroundURL: url })),
      logOutUser: () => set(initialState),
      updateLastBackup: (dateString)=> set(()=> ({lastBackup:dateString})),
      updateBackupEvery:(number) => set(() => ({backupEvery:number * DAY}))
    }),
    {
      name: userKey,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
