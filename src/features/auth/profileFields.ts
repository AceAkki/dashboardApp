import { Alert, Linking } from "react-native";
import * as Location from "expo-location";

// Checks and location lookup shared by the Login and User Profile screens,
// so a rule is fixed in one place.

// a plain decimal number inside its allowed range, or null
export const parseCoord = (text: string, limit: number) => {
  const t = text.trim();
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Math.abs(n) <= limit ? n : null;
};

// GitHub usernames: letters, digits and single hyphens, no hyphen at either end, max 39
export const isGitId = (text: string) =>
  /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(text.trim());

// 4 decimals is about 11 m: plenty for weather, and no false precision stored
const round = (n: number) => Number(n.toFixed(4));

// Asks for permission if needed, then returns where the phone is, or null.
// It explains every failure itself, so callers only handle the success case.
export async function getCoords(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow location access or type your coordinates.",
        // after "Don't ask again" the only way back is the phone's settings
        perm.canAskAgain
          ? undefined
          : [
              { text: "Cancel", style: "cancel" },
              { text: "Open settings", onPress: () => Linking.openSettings() },
            ],
      );
      return null;
    }
    // a recent known position is instant; a fresh GPS fix can take several seconds
    const known = await Location.getLastKnownPositionAsync({
      maxAge: 10 * 60 * 1000,
    });
    const pos =
      known ??
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }));
    return {
      latitude: round(pos.coords.latitude),
      longitude: round(pos.coords.longitude),
    };
  } catch (err: any) {
    Alert.alert("Couldn't get location", err?.message ?? "Unknown error");
    return null;
  }
}
