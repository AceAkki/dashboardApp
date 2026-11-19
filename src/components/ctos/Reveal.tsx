import { useEffect, useState, type ReactNode } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { takeEntering, useLeaving } from "@/global/motion";
import { fontSize, motion } from "@/style/globalStyles";

// Wraps one list row so it animates by itself:
//   - a row that was just added (or restored by UNDO) fades and slides in
//   - a row that is being deleted or moved away plays the ctOS exit: a jolt, a block over the row
//     reading ▒▒▒ DELETED ▒▒▒ (or → MOVED), then the row collapses
//     (call `leaveThen(id, remove, kind)` from global/motion for that)
// Every row handles its own motion, so nothing depends on how the rest of the screen lays out.
const KINDS = {
  delete: { label: "▒▒▒ DELETED ▒▒▒", color: Colors.danger },
  move: { label: "→ MOVED", color: Colors.primary },
} as const;

const lin = Easing.linear;

export default function Reveal({
  id,
  children,
  stays = false,
}: {
  id: string;
  children: ReactNode;
  /** the row is still in this list after a "move" (the ALL tab): the block flashes and clears, no collapse */
  stays?: boolean;
}) {
  const kind = useLeaving(id);
  const [v] = useState(() => new Animated.Value(takeEntering(id) ? 0 : 1)); // 0..1: row visible
  const [ov] = useState(() => new Animated.Value(0)); // cover block
  const [jolt] = useState(() => new Animated.Value(0));
  const [height, setHeight] = useState(0);

  // enter
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: motion.slide, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [v]);

  // exit: jolt + cover (≈160 ms), then collapse (≈140 ms)
  useEffect(() => {
    if (!kind) return;
    const step = (to: number) =>
      Animated.timing(jolt, { toValue: to, duration: 28, easing: lin, useNativeDriver: false });
    const flash = Animated.parallel([
      Animated.timing(ov, { toValue: 1, duration: 60, easing: lin, useNativeDriver: false }),
      Animated.sequence([step(-5), step(5), step(-3), step(3), step(0)]),
    ]);
    const anim = Animated.sequence([
      flash,
      Animated.delay(20),
      kind === "move" && stays
        ? Animated.timing(ov, { toValue: 0, duration: 120, easing: lin, useNativeDriver: false })
        : Animated.timing(v, { toValue: 0, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: false }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [kind, stays, v, ov, jolt]);

  // the exit is over but this row is still on screen (it was only changed): put it back as it was
  useEffect(() => {
    if (kind) return;
    v.setValue(1);
    ov.setValue(0);
    jolt.setValue(0);
  }, [kind, v, ov, jolt]);

  const k = kind ? KINDS[kind] : null;

  return (
    <Animated.View
      onLayout={(e) => {
        if (!kind) setHeight(e.nativeEvent.layout.height);
      }}
      style={{
        opacity: v,
        overflow: "hidden",
        transform: [
          { translateX: Animated.add(jolt, v.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] })) },
        ],
        ...(kind && height > 0
          ? { height: v.interpolate({ inputRange: [0, 1], outputRange: [0, height] }) }
          : null),
      }}
    >
      {children}
      {k ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.cover, { opacity: ov, borderLeftColor: k.color, borderColor: k.color }]}
        >
          <Animated.Text style={[styles.label, { color: k.color }]}>{k.label}</Animated.Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderLeftWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontFamily: Typography.primary_bold, fontSize: fontSize.sm, letterSpacing: 2 },
});
