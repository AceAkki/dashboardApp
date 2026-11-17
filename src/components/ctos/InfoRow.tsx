import { StyleSheet, Text, View } from "react-native";

import globalStyles, { spacing } from "@/style/globalStyles";

// LABEL ........ value, in an inset tile
export default function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={[globalStyles.inset, styles.row]}>
      <Text style={globalStyles.textCaption}>{label}</Text>
      <Text style={[globalStyles.cardTitle, styles.value]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: 10,
  },
  value: { flexShrink: 1, textAlign: "right" },
});
