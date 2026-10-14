import { Stack } from "expo-router";

export default function RootLayout() {
  // android gradle setup done for dev build for android
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown:false }} />
      <Stack.Screen
        name="taskManager"
        options={{
          title: "Task Manager",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
