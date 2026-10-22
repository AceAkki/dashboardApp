import { useEffect, useState } from "react";
import { Stack } from "expo-router";

import { useUserStore } from "@/features/auth/useAuthStore";

export default function RootLayout() {
  // android gradle setup done for dev build for android
  const isLoggedIn = useUserStore((state) => state.username.length > 0);

  // the persisted user loads asynchronously from AsyncStorage; wait for it so a
  // logged-in user doesn't flash the login screen
  const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useUserStore.persist.hasHydrated());
    return unsub;
  }, []);

  if (!hydrated) return null;

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="taskManager"
          options={{
            title: "Task Manager",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="weather"
          options={{
            title: "Weather",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pomodoro"
          options={{
            title: "Pomodoro",
            headerShown: false,
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
