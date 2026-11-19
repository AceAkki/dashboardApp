import { useEffect, useState } from "react";

import { writeClipboardText } from "@/global/globalFunctions";
import { feedback } from "@/hooks/useFeedback";
import TextAction from "./TextAction";

// COPY word-button; says COPIED for 1.5 s
export default function CopyButton({ text: value }: { text: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1500);
    return () => clearTimeout(t);
  }, [done]);

  const press = async () => {
    await writeClipboardText(value);
    feedback.success();
    setDone(true);
  };

  return <TextAction label={done ? "COPIED" : "COPY"} haptic="none" onPress={press} />;
}
