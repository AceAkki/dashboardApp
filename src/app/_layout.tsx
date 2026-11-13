import StatusStrip from "@/components/ctos/StatusStrip";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useShallow } from "zustand/shallow";
// new ------------------------
import * as SplashScreen from "expo-splash-screen";

import { Colors } from "@/constants/Colors";

import { useUserStore } from "@/features/auth/useAuthStore";
import useTaskReminders from "@/features/tasks/hooks/useTaskReminders";

import {bootMap, type BootMapKey} from "@/global/bootMap"

export default function RootLayout() {
  const {username, isLoggedIn, BootOption } = useUserStore(
    useShallow((s) => ({
      username:s.username,
      isLoggedIn :  s.username.length > 0,
      BootOption: s.BootOption
    })));
  const BootScreen = bootMap[BootOption as BootMapKey];

  // the persisted user loads asynchronously from AsyncStorage; wait for it so a logged-in user doesn't flash the login screen
  const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useUserStore.persist.hasHydrated());
    return unsub;
  }, []);

  // boot screen shows once per app launch, after the native splash hides
  const [booted, setBooted] = useState(false);

  // new ------------------------
  const ready = hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // keeps the phone's reminders in step with the saved tasks, from any screen
  useTaskReminders();

  if (!ready) return null;
  // boot screen
  if (!booted) return <BootScreen onDone={() => setBooted(true)} username={username} />;

  return (
    <>
      <Stack
        screenOptions={{
          animation: "fade",
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="UserProfile"
            options={{
              title: "User Profile",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TaskManager"
            options={{
              title: "Task Manager",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Weather"
            options={{
              title: "Weather",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Feed"
            options={{
              title: "Feed",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Tools"
            options={{
              title: "Tools",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SnippetVault"
            options={{
              title: "Snippet Vault",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Pomodoro"
            options={{
              title: "Pomodoro",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Tool"
            options={{ title: "Tool", headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusStrip />
    </>
  );
}
