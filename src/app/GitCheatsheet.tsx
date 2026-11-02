import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { writeClipboardText } from "@/global/globalFunctions";
import { searchGit, type GitCommand } from "@/features/tools/logic/gitCheatsheet";
import { Field, Hint, Stack, ToolScreen } from "@/features/tools/toolKit";
import { fontSize, insetBase, text } from "@/style/globalStyles";

// one command; tapping it copies it
function CommandRow({ item }: { item: GitCommand }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await writeClipboardText(item.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Pressable style={styles.row} onPress={copy} accessibilityRole="button" accessibilityLabel={`Copy ${item.cmd}`}>
      <View style={styles.head}>
        <Text style={styles.cmd}>{item.cmd}</Text>
        <Text style={styles.copy}>{copied ? "COPIED" : "COPY"}</Text>
      </View>
      <Text style={styles.note}>{item.note}</Text>
    </Pressable>
  );
}

export default function GitCheatsheet() {
  const [query, setQuery] = useState("");
  const sections = searchGit(query);

  return (
    <ToolScreen title="Git Cheatsheet">
      <Panel title="SEARCH">
        <Field label="COMMAND OR WORD" value={query} onChangeText={setQuery} placeholder="stash · undo · rebase" />
      </Panel>

      {sections.map((s) => (
        <Panel key={s.title} title={s.title.toUpperCase()}>
          <Stack>
            {s.items.map((item) => (
              <CommandRow key={item.cmd} item={item} />
            ))}
          </Stack>
        </Panel>
      ))}
      {sections.length === 0 ? <Hint>NOTHING MATCHES</Hint> : null}
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  row: { ...insetBase, padding: 10, gap: 4 },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  cmd: { flex: 1, fontFamily: Typography.primary, color: Colors.primary, fontSize: fontSize.sm + 1, lineHeight: 17 },
  copy: { ...text.caption, color: Colors.primary },
  note: { ...text.caption, color: Colors.textSecondary },
});
