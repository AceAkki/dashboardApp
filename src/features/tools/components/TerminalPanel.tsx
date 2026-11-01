import { useState } from "react";
import {Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { TASK_EXAMPLE, runCommand } from "../terminalCommands";
import { useToolsStore } from "../hooks/useToolsStore";

import { Colors } from "@/constants/Colors";
import styles from "../toolsStyles";

export default function TerminalPanel() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const submit = () => {
    if (!value.trim()) return;
    setResult(runCommand(value, (path) => router.replace(path as never)));
    setValue("");
  };

  return (
    <View>
      <View style={styles.prompt}>
        <Text style={styles.promptSign}>&gt;</Text>
        <TextInput
          style={styles.promptInput}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={submit}
          placeholder={TASK_EXAMPLE}
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          accessibilityLabel="Command input"
        />
      </View>
      <Text
        style={[
          styles.output,
          result && { color: result.ok ? Colors.success : Colors.danger },
        ]}
      >
        {result
          ? `${result.ok ? "OK" : "ERR"} · ${result.message}`
          : "TASK · NOTE · TIMER · GO  —  TYPE help"}
      </Text>
    </View>
  );
}
