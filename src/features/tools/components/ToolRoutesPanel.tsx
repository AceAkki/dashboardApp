import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize, insetBase, text } from "@/style/globalStyles";
import { TOOL_ROUTES } from "../toolRoutes";

// Links to the tools that open as their own screen.
export default function ToolRoutesPanel() {
  const router = useRouter();

  return (
    <Panel title="MORE TOOLS">
      <View style={styles.list}>
        {TOOL_ROUTES.map((r) => (
          <Pressable
            key={r.name}
            style={styles.row}
            onPress={() => router.push(`/${r.name}` as never)}
            accessibilityRole="button"
            accessibilityLabel={r.title}
          >
            <Ionicons name={r.icon} size={20} color={Colors.primary} />
            <View style={styles.body}>
              <Text style={styles.title}>{r.title}</Text>
              <Text style={styles.blurb}>{r.blurb}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: { ...insetBase, flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  body: { flex: 1, gap: 2 },
  title: {
    fontFamily: Typography.primary_medium,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
  },
  blurb: { ...text.muted, fontSize: fontSize.xs },
});
