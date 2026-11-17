import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { writeClipboardText } from "@/global/globalFunctions";
import { feedback } from "@/global/useFeedback";
import { hitSlop, text } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

// COPY text button; says COPIED for 1.5 s
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

  return (
    <CtosPressable haptic="none" pressedStyle={{ opacity: 0.5 }} onPress={press} hitSlop={hitSlop}>
      <Text style={styles.action}>{done ? "COPIED" : "COPY"}</Text>
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  action: { ...text.caption, color: Colors.primary },
});
