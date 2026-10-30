import { useCallback, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Local notifications (the phone shows them itself, no server needed).
//
//   const { notify, schedule, cancel, permission, openSettings } = useNotifications();
//
//   await notify({ title: "Saved", body: "Your note is stored" });      // now
//   const id = await schedule({ title: "Stand-up" }, new Date(...));    // later
//   if (id) await cancel(id);                                           // change of plan
//
// notify / schedule ask for permission themselves, at the moment they are used.
// They return null when nothing was sent (permission refused, date in the past).
//
// Setup in a new project:
//   npx expo install expo-notifications
//   app.json  ->  "plugins": ["expo-notifications"]
//   test on a real device with a development build (Expo Go is limited).

export type NotificationInput = {
  title: string;
  body?: string;
  data?: Record<string, unknown>; // anything you want back when the user taps it
};

// Android 8+ shows every notification through a "channel". "default" is the
// one expo-notifications uses when you don't name a channel.
const CHANNEL_ID = "default";

// scheduling does not exist on web
const supported = Platform.OS !== "web";

// By default a notification is NOT shown while the app is open. This says
// "show it anyway". It is global (one per app), so it lives outside the hook.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function useNotifications() {
  // kept in state so the screen can react: e.g. show an "Enable notifications" button
  const [permission, setPermission] = useState<Notifications.PermissionStatus>(
    Notifications.PermissionStatus.UNDETERMINED,
  );

  // read the current permission once, when the screen opens
  useEffect(() => {
    if (!supported) return;
    Notifications.getPermissionsAsync().then((p) => setPermission(p.status));
  }, []);

  // Ask only when we are about to send, not at app start: the user understands
  // why they are being asked. Returns true when we are allowed to send.
  const ensurePermission = useCallback(async () => {
    if (!supported) return false;

    // the channel must exist before Android shows the permission prompt
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "General",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    let current = await Notifications.getPermissionsAsync();
    // once the user taps "Don't allow" the system will not ask again
    if (current.status !== Notifications.PermissionStatus.GRANTED && current.canAskAgain) {
      current = await Notifications.requestPermissionsAsync();
    }
    setPermission(current.status);
    return current.status === Notifications.PermissionStatus.GRANTED;
  }, []);

  // show a notification right now
  const notify = useCallback(
    async (input: NotificationInput) => {
      if (!(await ensurePermission())) return null;
      return Notifications.scheduleNotificationAsync({
        content: input,
        trigger: null, // null = immediately
      });
    },
    [ensurePermission],
  );

  // show a notification at a date and time; returns an id you can cancel
  const schedule = useCallback(
    async (input: NotificationInput, when: Date) => {
      if (when.getTime() <= Date.now()) return null; // nothing to schedule in the past
      if (!(await ensurePermission())) return null;
      return Notifications.scheduleNotificationAsync({
        content: input,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: when,
        },
      });
    },
    [ensurePermission],
  );

  const cancel = useCallback(async (id: string) => {
    if (supported) await Notifications.cancelScheduledNotificationAsync(id);
  }, []);

  const cancelAll = useCallback(async () => {
    if (supported) await Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  // for when permission is "denied": the only way back is the phone's settings
  const openSettings = useCallback(() => Linking.openSettings(), []);

  return { permission, notify, schedule, cancel, cancelAll, openSettings };
}
