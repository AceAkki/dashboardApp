import { useEffect, useState, type ReactNode } from "react";
import { AccessibilityInfo, View, type StyleProp, type ViewStyle } from "react-native";
import { CtosRevealContext } from "@/components/ctosReveal";

// CTOS-style replacement for FadeInItem. Instead of a smooth fade and slide, the
// block "boots in": it blinks on and off a few times with a small sideways
// glitch, then settles. Same props as FadeInItem, so it drops straight in.
//
//   <CtosItem index={0}> ...card... </CtosItem>
//
// Any <CtosText> inside waits for the reveal, so its scramble plays when the
// block appears, not while it is still invisible.
//
// index      position in the stagger (0, 1, 2 ...)
// baseDelay  ms before the first block appears (default 300, same as FadeInItem)
// step       ms between blocks (default 150, same as FadeInItem)
// frame      ms per flicker step (default 40; ~25 fps, like the video)
// style      extra style for the wrapper

// [visible, sideways offset in px] for each flicker step
const PATTERN: [boolean, number][] = [
  [true, 8],
  [false, 0],
  [true, -4],
  [true, 3],
  [true, 0],
];

type Props = {
  index?: number;
  children: ReactNode;
  baseDelay?: number;
  step?: number;
  frame?: number;
  style?: StyleProp<ViewStyle>;
};

export default function CtosItem({
  index = 0,
  children,
  baseDelay = 300,
  step = 150,
  frame = 40,
  style,
}: Props) {
  // -1 = not yet visible, 0..PATTERN.length-1 = flicker step
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const start = baseDelay + index * step;

    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        timers.push(setTimeout(() => setPhase(PATTERN.length - 1), start));
        return;
      }
      PATTERN.forEach((_, i) => {
        timers.push(setTimeout(() => setPhase(i), start + i * frame));
      });
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [index, baseDelay, step, frame]);

  const [visible, dx] = phase < 0 ? [false, 0] : PATTERN[phase];

  return (
    <CtosRevealContext.Provider value={phase >= 0}>
      <View
        style={[
          { opacity: visible ? 1 : 0, transform: [{ translateX: dx }] },
          style,
        ]}
      >
        {children}
      </View>
    </CtosRevealContext.Provider>
  );
}
