import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { hud, motion } from "@/style/globalStyles";
import { ease } from "@/global/motion";
import CtosPressable from "./CtosPressable";

type Item = {
  label: string;
  path: "/" | "/TaskManager" | "/SnippetVault" | "/Feed" | "/Tools";
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

const ITEMS: Item[] = [
  { label: "HOME", path: "/", icon: "grid-outline" },
  { label: "TASKS", path: "/TaskManager", icon: "checkbox-outline" },
  { label: "SNIPPETS", path: "/SnippetVault", icon: "document-text-outline" },
  { label: "FEED", path: "/Feed", icon: "pulse-outline" },
  { label: "TOOLS", path: "/Tools", icon: "terminal-outline" },
];

// Each screen mounts its own bar, so the active tab "draws in" on mount: the line grows from the centre
// and the icon settles from slightly small.
function ActiveMark({ children }: { children: React.ReactNode }) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    ease(t, 1, motion.slide);
  }, [t]);
  return (
    <>
      <Animated.View style={[styles.activeLine, { transform: [{ scaleX: t }] }]} />
      <Animated.View
        style={{
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
          transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
        }}
      >
        {children}
      </Animated.View>
    </>
  );
}

export default function CtosNavBar() {
  const router = useRouter();
  const pathname = usePathname().toLowerCase();

  return (
    <View style={styles.bar}>
      {ITEMS.map((item) => {
        const active = pathname === item.path.toLowerCase();
        const color = active ? Colors.primary : Colors.textSecondary;
        return (
          <CtosPressable
            key={item.label}
            haptic="select"
            pressedStyle={{ opacity: 0.6 }}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            onPress={() => {
              if (!active) router.push(item.path);
            }}
          >
            {active ? (
              <ActiveMark>
                <Ionicons name={item.icon} size={20} color={color} />
              </ActiveMark>
            ) : (
              <Ionicons name={item.icon} size={20} color={color} />
            )}
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </CtosPressable>
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
