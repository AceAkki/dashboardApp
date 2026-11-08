import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useUserStore } from "@/features/auth/useAuthStore";
import { TOOL_ROUTES } from "@/features/tools/toolRoutes";
import useTaskReminders from "@/features/tasks/hooks/useTaskReminders";
import BootScreen from "@/components/BootScreen";
import { Colors } from "@/constants/Colors";

// new ------------------------
import * as SplashScreen from "expo-splash-screen";

// ctos based -
// import BootAnimation from "@/components/BootAnimation";
// import BootSequence from "@/components/BootSequence";

export default function RootLayout() {
  const isLoggedIn = useUserStore((state) => state.username.length > 0);

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
  if (!booted) return <BootScreen onDone={() => setBooted(true)} />;

  return (
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
        {TOOL_ROUTES.map((r) => (
          <Stack.Screen
            key={r.name}
            name={r.name}
            options={{ title: r.title, headerShown: false }}
          />
        ))}
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
