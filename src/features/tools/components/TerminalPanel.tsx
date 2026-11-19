import { useState } from "react";
import {Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { TASK_EXAMPLE, runCommand } from "../terminalCommands";

import { Colors } from "@/constants/Colors";
import Hint from "@/components/ctos/Hint";
import Status from "@/components/ctos/Status";
import { feedback } from "@/hooks/useFeedback";
import styles from "../toolsStyles";

export default function TerminalPanel() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const submit = () => {
    if (!value.trim()) return;
    const r = runCommand(value, (path) => router.replace(path as never));
    setResult(r);
    if (r.ok) feedback.success();
    else feedback.error();
    setValue("");
  };

  const defaultMsg = "TASK · NOTE · TIMER · GO · START  —  TYPE help";

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
      <View style={styles.outputRow}>
        {result ? (
          <Status tone={result.ok ? "ok" : "err"}>{result.message}</Status>
        ) : (
          <Hint>{defaultMsg}</Hint>
        )}
      </View>
    </View>
  );
}
