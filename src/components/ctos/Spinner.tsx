import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import useAsciiSpinner from "@/global/useAsciiSpinner";
import { fontSize, text } from "@/style/globalStyles";

// small `| / - \` spinner for card headers; mount it only while loading
export default function Spinner() {
  const spin = useAsciiSpinner(true);
  return (
    <Text style={styles.spin} accessibilityLabel="Loading">
      {spin}
    </Text>
  );
}

const styles = StyleSheet.create({
  spin: { ...text.caption, color: Colors.primary, fontSize: fontSize.md },
});
