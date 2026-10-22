import { Stack } from "expo-router";

// Replaces AuthLayout's <Outlet />: the (auth) group wraps its child screens
// (login) in a Stack. The group name isn't part of the URL, so this is still /login.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
