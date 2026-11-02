import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { classOf, searchStatus, STATUS_CLASSES } from "@/features/tools/logic/httpStatus";
import { Chip, ChipRow, Field, Hint, Stack, ToolScreen } from "@/features/tools/toolKit";
import { fontSize, insetBase, text } from "@/style/globalStyles";

export default function HttpStatus() {
  const [query, setQuery] = useState("");
  const [classKey, setClassKey] = useState<string | null>(null);

  const found = searchStatus(query, classKey);

  return (
    <ToolScreen title="HTTP Status Codes">
      <Panel title="SEARCH">
        <Stack>
          <Field label="CODE, NAME OR WORD" value={query} onChangeText={setQuery} placeholder="404 · timeout · redirect" />
          <ChipRow>
            <Chip label="ALL" active={classKey === null} onPress={() => setClassKey(null)} />
            {STATUS_CLASSES.map((c) => (
              <Chip key={c.key} label={c.key} active={classKey === c.key} onPress={() => setClassKey(c.key)} />
            ))}
          </ChipRow>
        </Stack>
      </Panel>

      <Panel title={`CODES · ${found.length}`}>
        <Stack>
          {found.map((s) => {
            const cls = classOf(s.code);
            return (
              <View key={s.code} style={[styles.row, { borderLeftColor: cls.color }]}>
                <Text style={[styles.code, { color: cls.color }]}>{s.code}</Text>
                <View style={styles.body}>
                  <Text style={styles.name}>{s.name}</Text>
                  <Text style={styles.text}>{s.text}</Text>
                </View>
              </View>
            );
          })}
          {found.length === 0 ? <Hint>NOTHING MATCHES</Hint> : null}
        </Stack>
      </Panel>
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  row: { ...insetBase, flexDirection: "row", gap: 12, padding: 10 },
  code: { fontFamily: Typography.primary_bold, fontSize: fontSize.lg, width: 44 },
  body: { flex: 1, gap: 2 },
  name: { fontFamily: Typography.primary_medium, color: Colors.textPrimary, fontSize: fontSize.md },
  text: { ...text.body, color: Colors.textSecondary, fontSize: fontSize.sm + 1 },
});
