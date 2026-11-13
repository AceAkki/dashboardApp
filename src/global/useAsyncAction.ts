import { useCallback, useRef, useState } from "react";

import { feedback } from "./useFeedback";

// Runs an async function and keeps track of it: busy, data, error.
//
//   const ping = useAsyncAction(pingSite);   // pingSite must be declared OUTSIDE the component
//   <Button onPress={() => ping.run("example.com")} />
//   ping.busy / ping.data / ping.error
//
// The function should throw an Error with a readable message when it fails.
export default function useAsyncAction<A extends unknown[], T>(
  fn: (...args: A) => Promise<T>,
) {
  const [state, setState] = useState<{
    busy: boolean;
    data: T | null;
    error: string | null;
  }>({ busy: false, data: null, error: null });

  // if run() is called twice quickly, only the latest call may update the screen
  const latest = useRef(0);

  const run = useCallback(
    async (...args: A) => {
      const id = ++latest.current;
      setState({ busy: true, data: null, error: null });
      try {
        const data = await fn(...args);
        if (id === latest.current) {
          setState({ busy: false, data, error: null });
          feedback.success(); // a short vibration; the result itself is the visible answer
        }
      } catch (e) {
        if (id === latest.current) {
          setState({ busy: false, data: null, error: (e as Error).message || "FAILED" });
          feedback.error();
        }
      }
    },
    [fn],
  );

  return { ...state, run };
}
