import { useEffect, useState } from "react";

const FRAMES = ["|", "/", "-", "\\"];

// A terminal spinner: returns | / - \ in turn while `active`. "WORKING…" becomes `${spin} WORKING`.
export default function useAsciiSpinner(active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setI((n) => (n + 1) % FRAMES.length), 120);
    return () => clearInterval(t);
  }, [active]);
  return FRAMES[i];
}
