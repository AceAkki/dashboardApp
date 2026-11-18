import { StyleSheet, View } from "react-native";

import Field from "@/components/ctos/Field";
import Panel from "@/components/ctos/Panel";
import { spacing } from "@/style/globalStyles";
import { useToolsStore } from "../hooks/useToolsStore";
import type { StandupField } from "../toolTypes.ts";

const FIELDS: { key: StandupField; label: string; placeholder: string }[] = [
  { key: "yesterday", label: "YESTERDAY", placeholder: "What shipped" },
  { key: "today", label: "TODAY", placeholder: "What's planned" },
  { key: "blocked", label: "BLOCKED", placeholder: "Nothing" },
];

export default function StandupPanel() {
  const standup = useToolsStore((s) => s.standup);
  const setStandup = useToolsStore((s) => s.setStandup);

  return (
    <Panel title="STANDUP NOTES">
      <View style={styles.fields}>
        {FIELDS.map((f) => (
          <Field
            key={f.key}
            label={f.label}
            value={standup[f.key]}
            onChangeText={(t) => setStandup(f.key, t)}
            placeholder={f.placeholder}
            multiline
          />
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.md },
});
