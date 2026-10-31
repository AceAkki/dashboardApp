import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import { useToolsStore, type StandupField } from "../useToolsStore";

import styles from "../toolsStyles";

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
      {FIELDS.map((f, i) => (
        <View
          key={f.key}
          style={[styles.standupRow, i === 0 && styles.standupFirst]}
        >
          <Text style={styles.standupLabel}>{f.label}</Text>
          <TextInput
            style={styles.standupInput}
            value={standup[f.key]}
            onChangeText={(t) => setStandup(f.key, t)}
            placeholder={f.placeholder}
            placeholderTextColor={Colors.textMuted}
            multiline
          />
        </View>
      ))}
    </Panel>
  );
}
