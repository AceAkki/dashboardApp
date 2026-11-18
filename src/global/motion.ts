import { useEffect, useState, useSyncExternalStore } from "react";
import { AccessibilityInfo, Animated, Easing, LayoutAnimation, Platform, UIManager } from "react-native";

// Shared motion helpers. Durations live in style/globalStyles.ts (`motion`).
// Everything here respects the phone's "remove animations" setting.

let reduced = false;
const listeners = new Set<() => void>();
const set = (v: boolean) => {
  if (v === reduced) return;
  reduced = v;
  listeners.forEach((l) => l());
};
AccessibilityInfo.isReduceMotionEnabled().then(set).catch(() => {});
AccessibilityInfo.addEventListener("reduceMotionChanged", set);

if (Platform.OS === "android") UIManager.setLayoutAnimationEnabledExperimental?.(true);

export const isReducedMotion = () => reduced;

/** true while the phone asks for less motion */
export function useReduceMotion() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => reduced,
    () => false,
  );
}

/** Animate a value to `to` (jumps straight there when motion is reduced). */
export function ease(
  value: Animated.Value,
  to: number,
  ms: number,
  native = true,
  onDone?: () => void,
) {
  if (reduced || ms <= 0) {
    value.setValue(to);
    onDone?.();
    return;
  }
  Animated.timing(value, {
    toValue: to,
    duration: ms,
    easing: Easing.out(Easing.quad),
    useNativeDriver: native,
  }).start(() => onDone?.());
}

/**
 * Call right BEFORE a state change that adds, removes or moves list rows,
 * and the rows slide to their new place instead of jumping.
 */
export function animateNext() {
  if (reduced) return;
  LayoutAnimation.configureNext(LayoutAnimation.create(180, "easeInEaseOut", "opacity"));
}

/**
 * A number that counts to its new value instead of jumping. Pass `ms` from `motion.tick`.
 * The first value is shown as it is, with no count-up on mount.
 */
export function useCountTo(target: number, ms: number) {
  const [shown, setShown] = useState(target);
  const [prev, setPrev] = useState(target);
  if (target !== prev) {
    setPrev(target);
    if (reduced || ms <= 0) setShown(target);
  }
  useEffect(() => {
    if (reduced || ms <= 0 || shown === target) return;
    const from = shown;
    const start = Date.now();
    let frame = 0;
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / ms);
      setShown(Math.round(from + (target - from) * (1 - (1 - t) * (1 - t))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms]);
  return shown;
}
