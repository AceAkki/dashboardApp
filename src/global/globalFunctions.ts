import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";

import { userKey } from "./storageKeys";

export async function writeClipboardText(text: string) {
  try {
    await Clipboard.setStringAsync(text);
  } catch (error: any) {
    console.error(error.message);
  }
}

// React Native has no react-router loaders, so auth is split in two:
// a plain async check, and a hook that redirects from inside a screen.
export async function isLoggedIn(): Promise<boolean> {
  const userData = await AsyncStorage.getItem(userKey);
  return !!userData;
}

/** Call at the top of a protected screen. Returns true once the check passed. */
export function useRequireAuth(loginRoute: string = "/login") {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    isLoggedIn().then((ok) => {
      if (!active) return;
      if (!ok) router.replace(loginRoute as any);
      else setChecked(true);
    });
    return () => {
      active = false;
    };
  }, [router, loginRoute]);

  return checked;
}

// toggleClass has no React Native equivalent (no DOM / classList).
// Use state to switch between styles instead, e.g.
//   style={[styles.box, active && styles.boxActive]}

export const timeOfTheDayGreeting = () => {
  const currentHour = new Date().getHours();
  return currentHour < 12
    ? "¡Buenos Días"
    : currentHour < 19
      ? "Buenas Tardes"
      : "¡Buenas Noches";
};

export const checkImgURL = async (inputValue: string) => {
  try {
    const res = await fetch(inputValue);
    const isImageType = res.headers.get("content-type")?.includes("image");
    const isStatusOk = res.status === 200 && res.ok;
    return !!isImageType && isStatusOk;
  } catch {
    // network error / invalid URL
    return false;
  }
};

export const getNewTime = (future?: number | null): number => {
  return future ? new Date().getTime() + future : new Date().getTime();
};

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // isInternetReachable can be null while unknown; treat that as connected
      setOnline(!!state.isConnected && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  return online;
}
