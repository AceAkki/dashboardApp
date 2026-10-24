import { useCallback, useEffect, useRef, useState } from "react";

// CTOS-style text reveal.
// Letters and digits flicker through random characters, then lock onto the real
// ones from left to right. Spaces and symbols (: . - ° % ...) stay in place.
// Accepts strings or numbers.
//
// const { text, play } = useCtosText("DISCOVER");
// const { text } = useCtosText(temp);              // numbers work too
//
// Options:
//   duration  ms for the whole reveal               (default 600)
//   interval  ms between random flickers            (default 50)
//   autoPlay  run on mount and whenever value changes (default true)
//   trigger   any value; whenever it changes to something other than
//             undefined, the effect replays (use with autoPlay: false)
//   play()    returned too, for manual control

type Options = {
  duration?: number;
  interval?: number;
  autoPlay?: boolean;
  trigger?: string | number | boolean;
};

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@";

const scramble = (target: string, progress: number) => {
  const chars = Array.from(target);
  const n = chars.length;
  return chars
    .map((ch, i) => {
      if (!/[a-z0-9]/i.test(ch)) return ch; // keep spaces / symbols
      if (progress >= (i + 1) / n) return ch; // already locked in
      const r = POOL[Math.floor(Math.random() * POOL.length)];
      return /[a-z]/.test(ch) ? r.toLowerCase() : r; // keep lowercase text lowercase
    })
    .join("");
};

export function useCtosText(
  value: string | number,
  { duration = 600, interval = 50, autoPlay = true, trigger }: Options = {},
) {
  const target = String(value);
  const [display, setDisplay] = useState(() =>
    autoPlay ? scramble(target, 0) : target,
  );
  const raf = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const play = useCallback(() => {
    stop();
    const start = Date.now();
    let lastStep = -1;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / duration);
      if (p >= 1) {
        setDisplay(target);
        return;
      }
      const step = Math.floor(elapsed / interval);
      if (step !== lastStep) {
        lastStep = step;
        setDisplay(scramble(target, p));
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();
  }, [target, duration, interval, stop]);

  useEffect(() => {
    if (autoPlay || trigger !== undefined) play();
    else setDisplay(target);
    return stop;
  }, [target, autoPlay, trigger, play, stop]);

  return { text: display, play };
}

export default useCtosText;
