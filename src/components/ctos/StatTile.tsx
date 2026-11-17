import { StyleSheet, Text, View } from "react-native";

import globalStyles from "@/style/globalStyles";

// big number + caption
export default function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={[globalStyles.inset, styles.tile]}>
      <Text style={globalStyles.textReadout}>{value}</Text>
      <Text style={globalStyles.textCaption}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, paddingVertical: 10, paddingHorizontal: 10, gap: 2 },
});
