import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize } from "@/style/globalStyles";

// "> NO SNIPPETS_" with a blinking cursor, in place of plain muted text.
export default function EmptyState({ text }: { text: string }) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const blink = (to: number) => Animated.timing(opacity, { toValue: to, duration: 1, useNativeDriver: true });
    const loop = Animated.loop(
      Animated.sequence([Animated.delay(500), blink(0), Animated.delay(500), blink(1)]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Text style={styles.text} accessibilityLabel={text}>
      {"> "}
      {text.toUpperCase()}
      <Animated.Text style={{ opacity, color: Colors.primary }}>_</Animated.Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Typography.primary,
    fontSize: fontSize.sm,
    color: Colors.textMuted,
    letterSpacing: 1,
    paddingVertical: 16,
  },
});
