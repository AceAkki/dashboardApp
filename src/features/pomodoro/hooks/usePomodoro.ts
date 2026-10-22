import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

import { MODE_SECONDS, usePomodoroStore } from "./pomodoroStore";

export default function usePomodoro() {
  const store = usePomodoroStore(
    useShallow((s) => ({
      mode: s.mode,
      remaining: s.remaining,
      endAt: s.endAt,
      completedSessions: s.completedSessions,
      start: s.start,
      pause: s.pause,
      reset: s.reset,
      setMode: s.setMode,
      skip: s.skip,
      complete: s.complete,
    })),
  );

  const [hydrated, setHydrated] = useState(
    usePomodoroStore.persist.hasHydrated(),
  );
  useEffect(() => {
    const unsub = usePomodoroStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(usePomodoroStore.persist.hasHydrated());
    return unsub;
  }, []);

  const [now, setNow] = useState(Date.now());
  const running = store.endAt !== null;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setNow(Date.now());
      store.complete();
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const msLeft = store.endAt
    ? Math.max(0, store.endAt - now)
    : store.remaining * 1000;
  const secondsLeft = Math.ceil(msLeft / 1000);
  const totalMs = MODE_SECONDS[store.mode] * 1000;
  const progress = totalMs > 0 ? 1 - msLeft / totalMs : 0;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return {
    ...store,
    hydrated,
    running,
    secondsLeft,
    progress: hydrated ? progress : 0,
    label: hydrated ? `${mm}:${ss}` : "--:--",
  };
}
