import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize } from "@/style/globalStyles";
import { useStatusStore, type StatusTone } from "@/global/useFeedback";

const TONES: Record<StatusTone, { glyph: string; word: string; color: string }> = {
  ok: { glyph: "✓", word: "OK", color: Colors.success },
  warn: { glyph: "▲", word: "WARN", color: Colors.warning },
  err: { glyph: "✕", word: "ERR", color: Colors.danger },
};

const HIDDEN = -80;

// The one-line "OK · SAVED" strip. Mounted ONCE in app/_layout.tsx; call feedback.success("SAVED") from anywhere.
export default function StatusStrip() {
  const current = useStatusStore((s) => s.current);
  const insets = useSafeAreaInsets();
  const [y] = useState(() => new Animated.Value(HIDDEN));
  const id = current?.id;
  const message = current?.message;

  useEffect(() => {
    if (id === undefined) return;
    AccessibilityInfo.announceForAccessibility(message ?? "");
    Animated.timing(y, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(y, { toValue: HIDDEN, duration: 160, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished) useStatusStore.getState().clear(id);
        },
      );
    }, 1600);
    return () => clearTimeout(timer);
  }, [id, message, y]);

  if (!current) return null;
  const { glyph, word, color } = TONES[current.tone];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.strip,
        { top: insets.top + 8, borderColor: color, transform: [{ translateY: y }] },
      ]}
    >
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {glyph} {word} · {current.message.toUpperCase()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderLeftWidth: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontFamily: Typography.primary_bold,
    fontSize: fontSize.sm,
    letterSpacing: 1,
  },
});
