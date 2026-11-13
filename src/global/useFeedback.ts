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
//   fb.warn("DELETED");                 // before / after something destructive
//   fb.error("BAD FILE");               // something failed
//
// `feedback` is the same object without the hook, for code outside components
// (stores, terminal commands, backup.ts). Vibrations are skipped when the Haptics switch
// in Profile is off, but the status strip still shows.

export type StatusTone = "ok" | "warn" | "err";

type StatusStore = {
  current: { id: number; message: string; tone: StatusTone } | null;
  show: (message: string, tone: StatusTone) => void;
  clear: (id: number) => void;
};

let nextId = 1;
export const useStatusStore = create<StatusStore>()((set, get) => ({
  current: null,
  show: (message, tone) => set({ current: { id: nextId++, message, tone } }),
  clear: (id) => {
    if (get().current?.id === id) set({ current: null });
  },
}));

// fire and forget: a missing vibrator (or the web) must never break a button
const fire = (run: () => Promise<void>) => {
  if (Platform.OS === "web" || !useSettingsStore.getState().haptics) return;
  run().catch(() => {});
};

const status = (message: string | undefined, tone: StatusTone) => {
  if (message) useStatusStore.getState().show(message, tone);
};

export const feedback = {
  tap: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => fire(() => Haptics.selectionAsync()),
  success: (message?: string) => {
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    status(message, "ok");
  },
  warn: (message?: string) => {
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
    status(message, "warn");
  },
  error: (message?: string) => {
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
    status(message, "err");
  },
};

export default function useFeedback() {
  return feedback;
}
