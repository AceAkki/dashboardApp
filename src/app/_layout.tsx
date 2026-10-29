import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useUserStore } from "@/features/auth/useAuthStore";

// new ------------------------
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Typography } from "@/constants/Typography";
import { Colors } from "@/constants/Colors";
// import BootScreen from "@/components/BootScreen";

// ctos based -
// import BootAnimation from "@/components/BootAnimation";
import BootSequence from "@/components/BootSequence";

// keep the splash screen up until fonts + saved user are ready (no flash of
// system-font text, no flash of the login screen)
SplashScreen.preventAutoHideAsync();
// new end ------------------------

export default function RootLayout() {
  const isLoggedIn = useUserStore((state) => state.username.length > 0);

  // new ------------------------
  const [fontsLoaded, fontError] = useFonts({
    [Typography.primary]: require("../../assets/fonts/JetBrainsMono-Regular.ttf"),
    [Typography.primary_medium]: require("../../assets/fonts/JetBrainsMono-Medium.ttf"),
    [Typography.primary_bold]: require("../../assets/fonts/JetBrainsMono-Bold.ttf"),
    [Typography.primaryItalic]: require("../../assets/fonts/JetBrainsMono-Italic.ttf"),
    [Typography.numbers]: require("../../assets/fonts/FiraCode-Light.ttf"),
    [Typography.secondary]: require("../../assets/fonts/Inter18pt-Regular.ttf"),
    [Typography.secondary_medium]: require("../../assets/fonts/Inter18pt-Medium.ttf"),
    [Typography.secondary_semibold]: require("../../assets/fonts/Inter18pt-SemiBold.ttf"),
    [Typography.secondary_bold]: require("../../assets/fonts/Inter18pt-Bold.ttf"),
  });
  // new end ------------------------

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

  // if (!hydrated) return null;

  // boot screen shows once per app launch, after the native splash hides
  const [booted, setBooted] = useState(false);

  // new ------------------------
  const ready = hydrated && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (fontError) console.warn("Font loading failed:", fontError);
    if (ready) SplashScreen.hideAsync();
  }, [ready, fontError]);

  if (!ready) return null;
  if (!booted) return <BootSequence onDone={() => setBooted(true)} />;
  // new end ------------------------

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
          name="Pomodoro"
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
