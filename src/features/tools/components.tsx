import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import { writeClipboardText } from "@/global/globalFunctions";
import { TASK_EXAMPLE, runCommand } from "./terminalCommands";
import { useToolsStore, type StandupField } from "./useToolsStore";
import styles from "./toolsStyles";

// ---------- terminal ----------

export function TerminalPanel() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

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
        {result ? `${result.ok ? "OK" : "ERR"} · ${result.message}` : "TASK · NOTE · TIMER · GO  —  TYPE help"}
      </Text>
    </View>
  );
}

// ---------- standup ----------

const FIELDS: { key: StandupField; label: string; placeholder: string }[] = [
  { key: "yesterday", label: "YESTERDAY", placeholder: "What shipped" },
  { key: "today", label: "TODAY", placeholder: "What's planned" },
  { key: "blocked", label: "BLOCKED", placeholder: "Nothing" },
];

export function StandupPanel() {
  const standup = useToolsStore((s) => s.standup);
  const setStandup = useToolsStore((s) => s.setStandup);

  return (
    <Panel title="STANDUP NOTES">
      {FIELDS.map((f, i) => (
        <View key={f.key} style={[styles.standupRow, i === 0 && styles.standupFirst]}>
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

// ---------- snippets ----------

export function SnippetsPanel() {
  const snippets = useToolsStore((s) => s.snippets);
  const addSnippet = useToolsStore((s) => s.addSnippet);
  const deleteSnippet = useToolsStore((s) => s.deleteSnippet);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, snippetCode: string) => {
    await writeClipboardText(snippetCode);
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  };

  const save = () => {
    if (!title.trim() || !code.trim()) return;
    addSnippet(title.trim(), code.trim());
    setTitle("");
    setCode("");
    setAdding(false);
  };

  return (
    <Panel
      title="SNIPPETS"
      right={
        <Pressable onPress={() => setAdding((a) => !a)} hitSlop={10}>
          <Text style={styles.toggle}>{adding ? "CANCEL" : "+ NEW"}</Text>
        </Pressable>
      }
    >
      {snippets.map((s) => (
        <View key={s.id} style={styles.snippet}>
          <View style={styles.snippetHead}>
            <Text style={styles.snippetTitle}># {s.title}</Text>
            <View style={styles.snippetActions}>
              <Pressable onPress={() => copy(s.id, s.code)} hitSlop={8}>
                <Text style={styles.snippetAct}>{copied === s.id ? "COPIED" : "COPY"}</Text>
              </Pressable>
              <Pressable onPress={() => deleteSnippet(s.id)} hitSlop={8}>
                <Text style={styles.snippetDel}>DEL</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.snippetCode} selectable>
            {s.code}
          </Text>
        </View>
      ))}

      {snippets.length === 0 && !adding ? (
        <Text style={globalStyles.textMuted}>NO SNIPPETS SAVED</Text>
      ) : null}

      {adding ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.addInput}
            value={title}
            onChangeText={setTitle}
            placeholder="title"
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={styles.addCode}
            value={code}
            onChangeText={setCode}
            placeholder="command or code"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
          />
          <Pressable style={styles.addBtn} onPress={save}>
            <Text style={globalStyles.primaryBtnTxt}>Save</Text>
          </Pressable>
        </View>
      ) : null}
    </Panel>
  );
}
