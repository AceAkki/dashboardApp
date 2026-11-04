import { Alert, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { exactAlarmKey } from "./storageKeys";

// Android 14+ does not give a fresh install the "Alarms & reminders" setting, so reminders
// go out as inexact alarms that Doze can delay by minutes. Only the user can switch it on.
// JavaScript cannot read that setting, so we explain it ONCE and open the screen.
const needed = () => Platform.OS === "android" && Number(Platform.Version) >= 34;

export function openExactAlarmSettings() {
  if (!needed()) return;
  // "package:" opens this app's own row instead of the whole list of apps
  const pkg = Constants.expoConfig?.android?.package;
  IntentLauncher.startActivityAsync(
    IntentLauncher.ActivityAction.REQUEST_SCHEDULE_EXACT_ALARM,
    pkg ? { data: `package:${pkg}` } : undefined,
  ).catch(() => {}); // a phone without that screen: nothing to open
}

let asked = false; // also stops a double run (dev mode) from showing it twice

export async function askExactAlarmOnce() {
  if (!needed() || asked) return;
  asked = true;
  if (await AsyncStorage.getItem(exactAlarmKey)) return;
  await AsyncStorage.setItem(exactAlarmKey, "1"); // saved first: "Not now" is final

  Alert.alert(
    "Reminders on time",
    'Android can delay reminders by a few minutes. On the next screen, allow "Alarms & reminders" for this app.',
    [
      { text: "Not now", style: "cancel" },
      { text: "Open settings", onPress: openExactAlarmSettings },
    ],
  );
}
