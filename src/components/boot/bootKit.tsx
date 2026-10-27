import { useEffect, useRef, useState, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg from "react-native-svg";

// Shared bits for the four boot pieces (BarsLoader, GridAppText, HexLogin,
// CircleCube). Every piece draws on the SAME 480 x 496 canvas as the reference
// video, so pieces line up when you stack them in one container.

export const VB_W = 480;
export const VB_H = 496;
export const FPS = 30;
export const STROKE = 1.8;

export type BootProps = {
  /** width in px; height follows the canvas ratio (default 240) */
  size?: number;
  /** 1 = the video's speed, 0.5 = half speed, 2 = twice as fast */
  speed?: number;
  /** false = idle and hidden; true = run (default true) */
  play?: boolean;
  /** seconds to wait before starting (default 0) */
  delay?: number;
  /** restart when finished (default false) */
  loop?: boolean;
  /** keep showing the last frame when finished (default differs per piece) */
  holdLast?: boolean;
  /** line / fill colour (default white) */
  color?: string;
  /** freeze on one frame (0-based). Handy for previewing; ignores play/delay */
  frame?: number;
  style?: StyleProp<ViewStyle>;
  /** called once when the last frame has played */
  onDone?: () => void;
};

type ClockOptions = Pick<
  BootProps,
  "speed" | "play" | "delay" | "loop" | "holdLast" | "frame" | "onDone"
>;

/** Returns the frame index to draw (0 .. total-1), or -1 when nothing should show. */
export function useBootClock(
  total: number,
  { speed = 1, play = true, delay = 0, loop = false, holdLast = false, frame, onDone }: ClockOptions,
) {
  const [current, setCurrent] = useState(-1);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (frame !== undefined || !play) {
      setCurrent(-1);
      return;
    }
    const start = Date.now() + delay * 1000;
    let raf = 0;

    const tick = () => {
      const elapsed = ((Date.now() - start) / 1000) * FPS * speed;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      let idx = Math.floor(elapsed);
      if (idx >= total) {
        if (!loop) {
          setCurrent(holdLast ? total - 1 : -1);
          doneRef.current?.();
          return;
        }
        idx = idx % total;
      }
      setCurrent((prev) => (prev === idx ? prev : idx));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [play, speed, delay, loop, holdLast, total, frame]);

  return frame !== undefined ? Math.min(Math.max(frame, 0), total - 1) : current;
}

/** The drawing surface: a fixed-ratio box with the shared viewBox. */
export function BootCanvas({
  size = 240,
  style,
  children,
}: {
  size?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <View
      pointerEvents="none"
      style={[{ width: size, height: (size * VB_H) / VB_W }, style]}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
        {children}
      </Svg>
    </View>
  );
}

export const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const rad = (deg: number) => (deg * Math.PI) / 180;
