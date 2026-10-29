import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { hud } from "@/style/globalStyles";

type Item = {
  label: string;
  path: "/" | "/TaskManager" | "/Feed" | "/Tools";
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

const ITEMS: Item[] = [
  { label: "HOME", path: "/", icon: "grid-outline" },
  { label: "TASKS", path: "/TaskManager", icon: "checkbox-outline" },
  { label: "FEED", path: "/Feed", icon: "pulse-outline" },
  { label: "TOOLS", path: "/Tools", icon: "terminal-outline" },
];

export default function CtosNavBar() {
  const router = useRouter();
  const pathname = usePathname().toLowerCase();

  return (
    <View style={styles.bar}>
      {ITEMS.map((item) => {
        const active = pathname === item.path.toLowerCase();
        const color = active ? Colors.primary : Colors.textSecondary;
        return (
          <Pressable
            key={item.label}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            onPress={() => {
              if (!active) router.push(item.path);
            }}
          >
            {active ? <View style={styles.activeLine} /> : null}
            <Ionicons name={item.icon} size={20} color={color} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: hud.faint,
    backgroundColor: Colors.background,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingTop: 12,
    paddingBottom: 10,
  },
  label: {
    fontFamily: Typography.primary_medium,
    fontSize: 9,
    letterSpacing: 2,
  },
  activeLine: {
    position: "absolute",
    top: -1,
    width: "50%",
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
