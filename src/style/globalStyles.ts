import { StyleSheet } from "react-native";
//   npx expo install @react-native-async-storage/async-storage @react-native-community/datetimepicker @expo/vector-icons
// npx expo install expo-clipboard @react-native-community/netinfo @react-native-async-storage/async-storage
// npx expo install lottie-react-native @react-native-async-storage/async-storage @expo/vector-icons
// npx expo install expo-location
// npx expo install react-native-svg

// Set all headers, numbers, percentages, and CTAs ("EXECUTE", "HACK") to JetBrains Mono or Space Grotesk.
// Keep Inter (or swap to Geist) for small labels and body text.

export const radius = { sm: 10, md: 16, lg: 20, pill: 999 };

const globalStyles = StyleSheet.create({
  containerFull: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default globalStyles;
