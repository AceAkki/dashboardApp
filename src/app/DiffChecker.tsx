import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { diffLines, diffStats, type DiffLine } from "@/features/tools/logic/diff";
import {
  ActionButton,
  Chip,
  ChipRow,
  Field,
  Stack,
  Status,
  ToolScreen,
} from "@/features/tools/toolKit";
import { fontSize } from "@/style/globalStyles";

const LINE_LOOK = {
  same: { mark: " ", color: Colors.textSecondary, bg: "transparent" },
  add: { mark: "+", color: Colors.success, bg: Colors.successSoft },
  del: { mark: "−", color: Colors.danger, bg: Colors.dangerSoft },
} as const;

export default function DiffChecker() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [lines, setLines] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changesOnly, setChangesOnly] = useState(false);

  const compare = () => {
    try {
      setLines(diffLines(oldText, newText));
      setError(null);
    } catch (e) {
      setLines(null);
      setError((e as Error).message);
    }
  };

  const stats = lines ? diffStats(lines) : null;
  const shown = lines ? (changesOnly ? lines.filter((l) => l.kind !== "same") : lines) : [];

  return (
    <ToolScreen title="Diff Checker">
      <Panel title="TEXTS">
        <Stack>
          <Field label="ORIGINAL" value={oldText} onChangeText={setOldText} placeholder="old version" multiline />
          <Field label="CHANGED" value={newText} onChangeText={setNewText} placeholder="new version" multiline />
          <ActionButton label="COMPARE" onPress={compare} />
          {error ? <Status tone="error">{error}</Status> : null}
        </Stack>
      </Panel>

      {lines && stats ? (
        <Panel title="RESULT">
          <Stack>
            {stats.added + stats.removed === 0 ? (
              <Status tone="ok">IDENTICAL</Status>
            ) : (
              <Status tone="info">
                +{stats.added} ADDED · −{stats.removed} REMOVED
              </Status>
            )}
            <ChipRow>
              <Chip label="CHANGES ONLY" active={changesOnly} onPress={() => setChangesOnly((c) => !c)} />
            </ChipRow>
            <View>
              {shown.map((l, i) => (
                <View key={i} style={[styles.line, { backgroundColor: LINE_LOOK[l.kind].bg }]}>
                  <Text style={[styles.mark, { color: LINE_LOOK[l.kind].color }]}>{LINE_LOOK[l.kind].mark}</Text>
                  <Text style={[styles.code, { color: l.kind === "same" ? Colors.textSecondary : Colors.textPrimary }]} selectable>
                    {l.text || " "}
                  </Text>
                </View>
              ))}
            </View>
          </Stack>
        </Panel>
      ) : null}
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: "row", gap: 8, paddingHorizontal: 6, paddingVertical: 2 },
  mark: { fontFamily: Typography.primary_bold, fontSize: fontSize.sm + 1, width: 10 },
  code: { flex: 1, fontFamily: Typography.primary, fontSize: fontSize.sm + 1, lineHeight: 17 },
});
