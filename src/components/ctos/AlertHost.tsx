import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize } from "@/style/globalStyles";
import {
  resolveAlert,
  submitPrompt,
  useAlertStore,
  type AlertButton,
  type AlertDialog,
} from "@/global/ctosAlert";
import { feedback } from "@/hooks/useFeedback";
import Button from "./Button";
import CtosPressable from "./CtosPressable";
import FocusInput from "./FocusInput";

type Look = "solid" | "danger-solid" | "danger-line" | "ghost";

// How a button looks. Destructive is solid red when it is the main choice, but only an
// outline when a normal button sits next to it (Merge / Replace), so the risky one never
// looks like the default.
const lookOf = (b: AlertButton, all: AlertButton[]): Look => {
  if (b.style === "cancel") return "ghost";
  if (b.style === "destructive") {
    const hasNormal = all.some((o) => o.style !== "cancel" && o.style !== "destructive");
    return hasNormal ? "danger-line" : "danger-solid";
  }
  return "solid";
};

function Bracket({ color, pos }: { color: string; pos: "tl" | "tr" | "bl" | "br" }) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.bracket,
        { borderColor: color },
        pos === "tl" && { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
        pos === "tr" && { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
        pos === "bl" && { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
        pos === "br" && { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
      ]}
    />
  );
}

// dialog look names -> shared Button variants
const VARIANT = {
  solid: "primary",
  "danger-solid": "danger",
  "danger-line": "dangerLine",
  ghost: "secondary",
} as const;

function ActionButton({ text, look, onPress }: { text: string; look: Look; onPress: () => void }) {
  return <Button label={text} variant={VARIANT[look]} onPress={onPress} />;
}

// The typed answer. Its own component so the text and the error reset for every new prompt.
function PromptBody({ dialog, accent }: { dialog: AlertDialog; accent: string }) {
  const prompt = dialog.prompt!;
  const [text, setText] = useState(prompt.defaultValue ?? "");
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    const problem = prompt.validate?.(text);
    if (problem) {
      setError(problem);
      feedback.error();
      return;
    }
    submitPrompt(dialog, text);
  };

  return (
    <>
      <FocusInput
        autoFocus
        selectTextOnFocus
        error={!!error}
        value={text}
        onChangeText={(v) => {
          setText(v);
          setError(undefined);
        }}
        onSubmitEditing={submit}
        returnKeyType="done"
        placeholder={prompt.placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={prompt.secure}
        keyboardType={prompt.keyboardType}
        autoCapitalize={prompt.autoCapitalize ?? "none"}
        autoCorrect={false}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttons}>
        <ActionButton text="Cancel" look="ghost" onPress={() => resolveAlert(dialog)} />
        <ActionButton
          text={prompt.okText ?? "OK"}
          look={prompt.destructive ? "danger-solid" : "solid"}
          onPress={submit}
        />
      </View>
    </>
  );
}

// The ctOS dialog. Mounted ONCE in app/_layout.tsx; call ctosAlert(...) from anywhere.
export default function AlertHost() {
  const dialog = useAlertStore((s) => s.queue[0]);
  const { height } = useWindowDimensions();
  if (!dialog) return null;

  const { buttons } = dialog;
  const danger = dialog.prompt?.destructive || buttons.some((b) => b.style === "destructive");
  const accent = danger ? Colors.danger : Colors.primary;
  const cancel = buttons.find((b) => b.style === "cancel");

  return (
    <Modal
      key={dialog.id}
      transparent
      visible
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => resolveAlert(dialog, cancel)}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.root}>
        <CtosPressable
          haptic="none"
          accessible={false}
          style={styles.backdrop}
          pressedStyle={styles.backdrop}
          onPress={() => resolveAlert(dialog, cancel)}
        />
        <View
          accessibilityViewIsModal
          style={[styles.card, { shadowColor: accent }]}
        >
          <Text style={[styles.title, { color: accent }]}>{`// ${dialog.title.toUpperCase()}`}</Text>
          <View style={styles.rule} />
          {dialog.message ? (
            <ScrollView style={{ maxHeight: height * 0.45 }} bounces={false}>
              <Text style={styles.message}>{dialog.message}</Text>
            </ScrollView>
          ) : null}
          {dialog.prompt ? (
            <PromptBody dialog={dialog} accent={accent} />
          ) : (
            <View style={styles.buttons}>
              {buttons.map((b, i) => (
                <ActionButton
                  key={`${i}-${b.text}`}
                  text={b.text}
                  look={lookOf(b, buttons)}
                  onPress={() => resolveAlert(dialog, b)}
                />
              ))}
            </View>
          )}
          <Bracket color={accent} pos="tl" />
          <Bracket color={accent} pos="tr" />
          <Bracket color={accent} pos="bl" />
          <Bracket color={accent} pos="br" />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.7)" },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  title: {
    fontFamily: Typography.primary_bold,
    fontSize: fontSize.lg,
    letterSpacing: 1,
  },
  rule: { height: 1, backgroundColor: Colors.border, marginTop: 10, marginBottom: 14 },
  message: {
    fontFamily: Typography.primary,
    fontSize: fontSize.md,
    lineHeight: 21,
    color: Colors.textPrimary,
  },
  input: {
    marginTop: 14,
    height: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondarySoft,
    color: Colors.textPrimary,
    fontFamily: Typography.primary,
    fontSize: fontSize.lg,
  },
  error: {
    marginTop: 8,
    color: Colors.danger,
    fontFamily: Typography.primary,
    fontSize: fontSize.sm,
  },
  buttons: { marginTop: 18, gap: 10 },
  bracket: { position: "absolute", width: 16, height: 16 },
});