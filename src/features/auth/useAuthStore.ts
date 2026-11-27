import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";


import {defaultBootKey} from "@/global/bootMap";
import {HOUR, DAY} from "@/global/backup";
import { userKey } from "../../global/storageKeys";

export type userType = {
  username: string;
  userID: string;
  backgroundURL: string;
  BootOption: string;
  themeType: "light" | "dark";
  location: { latitude: number; longitude: number };
  lastBackup:string;
  autoBackup:boolean;
  backupFolder:string | null;
  currentBackupType:backUpKEY;
  backupEvery:number;
  rewindEvery:number;
};

export const BackupType = {
  Hour : HOUR,
  Day : DAY
}
type backUpKEY = keyof typeof BackupType;
const backupTypes = Object.keys(BackupType) as backUpKEY[];
const defaultBackupType = backupTypes[1];

const initialState: userType = {
  username: "",
  userID: "",
  backgroundURL: "",
  BootOption:defaultBootKey,
  themeType: "light",
  location: { latitude: 0, longitude: 0 },
  lastBackup: "",
  autoBackup: false,
  backupFolder: null,
  currentBackupType: defaultBackupType,
  backupEvery: 7 * BackupType[defaultBackupType],
  rewindEvery: BackupType[defaultBackupType],
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
  setBackupFolder: (path:string) => void;
  setAutoBackup: () => void;
  updateBackupType:(type:backUpKEY) => void,
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
      setBackupFolder: (path)=> set(()=> ({backupFolder:path})),
      setAutoBackup: () => set((prev) => ({autoBackup: !prev})),
      updateBackupType: (type) => set(() => ({currentBackupType:type})),
      updateBackupEvery:(number) => set(() => ({backupEvery:number}))
    }),
    {
      name: userKey,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
