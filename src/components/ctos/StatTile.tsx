import { StyleSheet, Text, View } from "react-native";

import globalStyles, { motion } from "@/style/globalStyles";
import { useCountTo } from "@/global/motion";

// big number + caption
export default function StatTile({ label, value }: { label: string; value: number | string }) {
  const counted = useCountTo(typeof value === "number" ? value : 0, motion.tick);
  return (
    <View style={[globalStyles.inset, styles.tile]}>
      <Text style={globalStyles.textReadout}>{typeof value === "number" ? counted : value}</Text>
      <Text style={globalStyles.textCaption}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, paddingVertical: 10, paddingHorizontal: 10, gap: 2 },
});
