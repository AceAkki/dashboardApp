import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { create } from "zustand";

import { useSettingsStore } from "./useSettingsStore";

// One place for "the app answers back": a short vibration and/or a one-line status strip.
//
//   const fb = useFeedback();           // in a component
//   fb.tap();                           // a press
//   fb.select();                        // a chip / tab / switch
//   fb.success("SAVED");                // vibration + strip   (message optional: no strip without it)
//   fb.warn("DELETED", { label: "UNDO", run: restore });   // strip with a tappable button, stays longer
//   fb.error("BAD FILE");               // something failed
//
// `feedback` is the same object without the hook, for code outside components
// (stores, terminal commands, backup.ts). Vibrations are skipped when the Haptics switch in Profile is off, but the status strip still shows.

export type StatusTone = "ok" | "warn" | "err";

export type StatusAction = { label: string; run: () => void };

type StatusStore = {
  current: { id: number; message: string; tone: StatusTone; action?: StatusAction } | null;
  show: (message: string, tone: StatusTone, action?: StatusAction) => void;
  clear: (id: number) => void;
};

let nextId = 1;
export const useStatusStore = create<StatusStore>()((set, get) => ({
  current: null,
  show: (message, tone, action) => set({ current: { id: nextId++, message, tone, action } }),
  clear: (id) => {
    if (get().current?.id === id) set({ current: null });
  },
}));

// Android: the system's own haptics (View.performHapticFeedback). expo-haptics' impactAsync /
// selectionAsync play a 50 ms buzz at ~12% strength there, which most phone motors don't show.
// These follow the phone's "touch feedback / vibration" setting and need no VIBRATE permission.
// Confirm / Reject need Android 11+, so older phones keep the notification buzz.
const android = (type: Haptics.AndroidHaptics) => () => Haptics.performAndroidHapticsAsync(type);
const api = typeof Platform.Version === "number" ? Platform.Version : 0;

const buzz = {
  tap: Platform.OS === "android"
    ? android(Haptics.AndroidHaptics.Virtual_Key)
    : () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  select: Platform.OS === "android"
    ? android(Haptics.AndroidHaptics.Keyboard_Tap)
    : () => Haptics.selectionAsync(),
  success: Platform.OS === "android" && api >= 30
    ? android(Haptics.AndroidHaptics.Confirm)
    : () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warn: Platform.OS === "android"
    ? android(Haptics.AndroidHaptics.Long_Press)
    : () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: Platform.OS === "android" && api >= 30
    ? android(Haptics.AndroidHaptics.Reject)
    : () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

// fire and forget: a missing vibrator (or the web) must never break a button
const fire = (name: keyof typeof buzz) => {
  if (Platform.OS === "web" || !useSettingsStore.getState().haptics) return;
  buzz[name]().catch((e) => {
    if (__DEV__) console.warn(`haptics.${name} failed`, e);
  });
};

const status = (message: string | undefined, tone: StatusTone, action?: StatusAction) => {
  if (message) useStatusStore.getState().show(message, tone, action);
};

export const feedback = {
  tap: () => fire("tap"),
  select: () => fire("select"),
  success: (message?: string, action?: StatusAction) => {
    fire("success");
    status(message, "ok", action);
  },
  warn: (message?: string, action?: StatusAction) => {
    fire("warn");
    status(message, "warn", action);
  },
  error: (message?: string) => {
    fire("error");
    status(message, "err");
  },
};

export default function useFeedback() {
  return feedback;
}
