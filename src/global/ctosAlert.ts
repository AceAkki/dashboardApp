import type { KeyboardTypeOptions, TextInputProps } from "react-native";
import { create } from "zustand";

// A drop-in for Alert.alert that draws the ctOS dialog (components/ctos/AlertHost.tsx) instead of
// the phone's own. Same call:
//
//   ctosAlert("Backup saved");                                   // one OK button
//   ctosAlert("Delete?", "Can't be undone.", [
//     { text: "Cancel", style: "cancel" },
//     { text: "Delete", style: "destructive", onPress: doIt },
//   ]);
//
// And the typed version, which gives back the text (or null when cancelled):
//
//   const ok = await ctosPrompt("Delete everything?", "Type DELETE to confirm.", {
//     destructive: true,
//     okText: "Delete",
//     validate: (t) => (t === "DELETE" ? undefined : "Type DELETE exactly"),
//   });
//   if (ok !== null) wipe();
//
// Works from anywhere (components, backup.ts, permission helpers). Dialogs shown while another is
// open wait in a queue and appear one after another.

export type AlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

export type PromptOptions = {
  defaultValue?: string;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  okText?: string;
  /** red dialog and red OK button, for "type DELETE" style confirms */
  destructive?: boolean;
  /** return a message to refuse the text (the dialog stays open), nothing to accept it */
  validate?: (text: string) => string | undefined;
};

type PromptSpec = PromptOptions & { resolve: (text: string | null) => void };

export type AlertDialog = {
  id: number;
  title: string;
  message?: string;
  buttons: AlertButton[];
  prompt?: PromptSpec;
};

type AlertStore = {
  queue: AlertDialog[];
  push: (dialog: AlertDialog) => void;
  remove: (id: number) => void;
};

export const useAlertStore = create<AlertStore>()((set) => ({
  queue: [],
  push: (dialog) => set((s) => ({ queue: [...s.queue, dialog] })),
  remove: (id) => set((s) => ({ queue: s.queue.filter((d) => d.id !== id) })),
}));

let nextId = 1;

export function ctosAlert(
  title: string,
  message?: string,
  buttons: AlertButton[] = [{ text: "OK" }],
) {
  useAlertStore.getState().push({
    id: nextId++,
    title,
    message,
    // an empty list would leave a dialog nobody can close
    buttons: buttons.length > 0 ? buttons : [{ text: "OK" }],
  });
}

export function ctosPrompt(
  title: string,
  message?: string,
  options: PromptOptions = {},
): Promise<string | null> {
  return new Promise((resolve) => {
    useAlertStore.getState().push({
      id: nextId++,
      title,
      message,
      buttons: [],
      prompt: { ...options, resolve },
    });
  });
}

// Closes a dialog, THEN runs the handler. The order matters: a handler often opens the next
// dialog ("Are you sure?"), and that one must find the first already gone.
// For a prompt, closing this way means "cancelled": the promise gets null.
export function resolveAlert(dialog: AlertDialog, button?: AlertButton) {
  useAlertStore.getState().remove(dialog.id);
  dialog.prompt?.resolve(null);
  button?.onPress?.();
}

// The OK of a prompt: close it and hand the typed text back.
export function submitPrompt(dialog: AlertDialog, text: string) {
  useAlertStore.getState().remove(dialog.id);
  dialog.prompt?.resolve(text);
}