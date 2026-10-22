import { Alert, Linking } from "react-native";

export const buildSearchUrl = (searchURL: string, query: string) =>
  `${searchURL}${encodeURIComponent(query.trim())}`;

// returns true if the link opened
export async function openLink(url: string, name: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert("Couldn't open link", name);
    return false;
  }
}
