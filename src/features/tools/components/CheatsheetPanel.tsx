import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import CtosPressable from "@/components/ctos/CtosPressable";
import EmptyState from "@/components/ctos/EmptyState";
import { writeClipboardText } from "@/global/globalFunctions";
import { feedback } from "@/global/useFeedback";
import { fontSize, insetBase, text } from "@/style/globalStyles";

import { searchCheatsheet, type CheatItem, type CheatSection } from "../logic/cheatsheet";
import { Field, Stack, Sub } from "../toolKit";

// one snippet; tapping it copies it
function SnippetRow({ item }: { item: CheatItem }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // don't set state after the row is gone (the search can remove it mid-timer)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    await writeClipboardText(item.cmd);
    feedback.success();
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <CtosPressable haptic="none" style={styles.row} onPress={copy} accessibilityRole="button" accessibilityLabel={`Copy ${item.cmd}`}>
      <View style={styles.head}>
        <Text style={styles.cmd}>{item.cmd}</Text>
        <Text style={styles.copy}>{copied ? "COPIED" : "COPY"}</Text>
      </View>
      <Text style={styles.note}>{item.note}</Text>
    </CtosPressable>
  );
}

type Props = {
  sections: CheatSection[];
  placeholder?: string;
};

// A searchable, tap-to-copy cheatsheet. Give it sections, it does the rest.
export default function CheatsheetPanel({ sections, placeholder }: Props) {
  const [query, setQuery] = useState("");
  const shown = searchCheatsheet(sections, query);

  return (
    <Stack>
      <Field label="SEARCH" value={query} onChangeText={setQuery} placeholder={placeholder ?? "map · filter · async"} />
      {shown.map((s) => (
        <Stack key={s.title}>
          <Sub>{s.title.toUpperCase()}</Sub>
          {s.items.map((item, i) => (
            <SnippetRow key={`${s.title}-${i}`} item={item} />
          ))}
        </Stack>
      ))}
      {shown.length === 0 ? <EmptyState text="nothing matches" /> : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  row: { ...insetBase, padding: 10, gap: 4 },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  cmd: { flex: 1, fontFamily: Typography.primary, color: Colors.primary, fontSize: fontSize.sm + 1, lineHeight: 17 },
  copy: { ...text.caption, color: Colors.primary },
  note: { ...text.caption, color: Colors.textSecondary },
});
