import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize, hud, motion, screenPad, text } from "@/style/globalStyles";
import { ease } from "@/global/motion";
import CtosPressable from "./CtosPressable";

export type Tab = { key: string; label: string; count?: number };

type Props = { tabs: Tab[]; index: number; onChange: (index: number) => void };

const pad = (n: number) => String(n).padStart(2, "0");

// Equal-width tabs: optional count over label, glowing underline on the active one.
export default function TabBar({ tabs, index, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const [x] = useState(() => new Animated.Value(0));
  const cell = width / Math.max(tabs.length, 1);
  useEffect(() => {
    if (cell > 0) ease(x, index * cell, motion.slide);
  }, [index, cell, x]);

  return (
    <View
      style={styles.row}
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {tabs.map((tab, i) => {
        const on = i === index;
        return (
          <CtosPressable
            key={tab.key}
            haptic="select"
            pressedStyle={{ opacity: 0.6 }}
            style={styles.item}
            onPress={() => onChange(i)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            {tab.count != null ? (
              <Text style={[styles.count, on && styles.on]}>{pad(tab.count)}</Text>
            ) : null}
            <Text style={[styles.label, on && styles.on]}>{tab.label.toUpperCase()}</Text>
          </CtosPressable>
        );
      })}
      {cell > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.underline,
            { width: cell * 0.72, left: cell * 0.14, transform: [{ translateX: x }] },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginHorizontal: screenPad,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: hud.faint,
  },
  item: { flex: 1, alignItems: "center", paddingTop: 8, paddingBottom: 11 },
  count: {
    fontFamily: Typography.primary_medium,
    fontSize: fontSize.lg,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  label: { ...text.caption, color: Colors.textSecondary },
  on: { color: Colors.primary },
  underline: {
    position: "absolute",
    bottom: -1,
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
