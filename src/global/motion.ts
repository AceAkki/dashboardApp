import { useEffect, useState, useSyncExternalStore } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";

import { motion } from "@/style/globalStyles";

// Shared motion helpers. Durations live in style/globalStyles.ts (`motion`).
// Everything here respects the phone's "remove animations" setting.
//
// Nothing runs when this file loads: the app can be started in the background with no screen
// (a snooze tap on a closed app), and the accessibility calls are only safe once something
// actually animates. The reduce-motion setting is read the first time it is needed.

let reduced = false;
let started = false;
const listeners = new Set<() => void>();
const set = (v: boolean) => {
  if (v === reduced) return;
  reduced = v;
  listeners.forEach((l) => l());
};

function start() {
  if (started) return;
  started = true;
  try {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(set)
      .catch(() => {});
    AccessibilityInfo.addEventListener("reduceMotionChanged", set);
  } catch {
    // no screen yet: animate normally
  }
}

export const isReducedMotion = () => {
  start();
  return reduced;
};

/** true while the phone asks for less motion */
export function useReduceMotion() {
  return useSyncExternalStore(
    (cb) => {
      start();
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
  if (isReducedMotion() || ms <= 0) {
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
 * A number that counts to its new value instead of jumping. Pass `ms` from `motion.tick`.
 * The first value is shown as it is, with no count-up on mount.
 */
export function useCountTo({
  target,
  ms,
  fromZero,
}: {
  target: number;
  ms: number;
  fromZero?: boolean;
}) {
  const [shown, setShown] = useState(() =>
    fromZero && !isReducedMotion() ? 0 : target,
  );
  const [prev, setPrev] = useState(target);
  if (target !== prev) {
    setPrev(target);
    if (isReducedMotion() || ms <= 0) setShown(target);
  }
  useEffect(() => {
    if (isReducedMotion() || ms <= 0 || shown === target) return;
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

/** Text that types itself in, with a block cursor while it is typing. Shows at once when motion is reduced. */
export function useTyped(full: string, ms = 15) {
  const [st, setSt] = useState(() => ({
    full,
    n: isReducedMotion() ? full.length : 0,
  }));
  if (st.full !== full) setSt({ full, n: isReducedMotion() ? full.length : 0 });
  const done = st.n >= full.length;
  useEffect(() => {
    if (done) return;
    const t = setInterval(
      () =>
        setSt((s) =>
          s.full === full ? { ...s, n: Math.min(full.length, s.n + 1) } : s,
        ),
      ms,
    );
    return () => clearInterval(t);
  }, [full, ms, done]);
  return done ? full : `${full.slice(0, st.n)}▌`;
}

// ── list rows: each row animates itself (see ctos/Reveal.tsx) ──────────────────

const entering = new Set<string>();
export type LeaveKind = "delete" | "move";
const leaving = new Map<string, LeaveKind>();
const rowListeners = new Set<() => void>();
const rowNotify = () => rowListeners.forEach((l) => l());

/** call when a row is about to be added or restored: it fades in when it first appears */
export const markEntering = (id: string) => {
  entering.add(id);
};
/** true once, for a row that was marked as new */
export const takeEntering = (id: string) => entering.delete(id);

/** "delete" or "move" while a row is on its way out, otherwise null */
export function useLeaving(id: string): LeaveKind | null {
  return useSyncExternalStore(
    (cb) => {
      rowListeners.add(cb);
      return () => rowListeners.delete(cb);
    },
    () => leaving.get(id) ?? null,
    () => null,
  );
}

/** Let the row fade out and shrink, then run `remove` (the real delete or move). */
export function leaveThen(
  id: string,
  remove: () => void,
  kind: LeaveKind = "delete",
) {
  if (isReducedMotion() || leaving.has(id)) {
    remove();
    return;
  }
  leaving.set(id, kind);
  rowNotify();
  setTimeout(() => {
    remove();
    leaving.delete(id);
    rowNotify();
  }, motion.leave);
}
