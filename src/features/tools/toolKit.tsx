import { useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import CtosScreen from "@/components/ctos/CtosScreen";
import Panel from "@/components/ctos/Panel";
import CtosText from "@/components/CtosText";
import { Colors } from "@/constants/Colors";
import { writeClipboardText } from "@/global/globalFunctions";
import globalStyles, { text } from "@/style/globalStyles";
import kit from "./toolKitStyles";

// The small building blocks every tool panel and tool screen is made from.

// ---------- layout ----------

// vertical spacing between the things inside a panel
export const Stack = ({ children }: { children: ReactNode }) => (
  <View style={kit.stack}>{children}</View>
);

// A panel that starts folded: tap the header to open it. Keeps a long list of tools short.
export function ToolPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Panel>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={[globalStyles.cardHead, open && { marginBottom: 12 }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <CtosText style={globalStyles.sectionLabel}>{`// ${title}`}</CtosText>
        <Ionicons
          name={open ? "remove" : "add"}
          size={16}
          color={Colors.primary}
        />
      </Pressable>
      {open ? <Stack>{children}</Stack> : null}
    </Panel>
  );
}

// A full screen tool: back link, title, scrolling body.
export function ToolScreen({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/Tools");

  return (
    <CtosScreen>
      <ScrollView
        contentContainerStyle={kit.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View>
          <Pressable onPress={goBack} style={kit.back} hitSlop={8}>
            <Ionicons name="chevron-back" size={14} color={Colors.primary} />
            <Text style={kit.backTxt}>TOOLS</Text>
          </Pressable>
          <Text style={globalStyles.sectionLabel}>{"// Tool"}</Text>
          <CtosText style={[globalStyles.textHeading, { marginTop: 6 }]}>
            {title}
          </CtosText>
        </View>
        {children}
      </ScrollView>
    </CtosScreen>
  );
}

export function ToolGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={kit.stack}>
      <Text style={globalStyles.sectionLabel}>{`// ${title}`}</Text>
      {children}
    </View>
  );
}
// ---------- input ----------

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  /** password style: dots, with a SHOW / HIDE button */
  secure?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
};

// Labelled text input with a PASTE button (CLEAR once there is text): typing on a phone is slow.
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  secure,
  keyboardType,
}: FieldProps) {
  const [hidden, setHidden] = useState(!!secure);

  const paste = async () => {
    try {
      onChangeText(await Clipboard.getStringAsync());
    } catch {
      // clipboard not available: nothing to paste
    }
  };

  return (
    <View style={kit.fieldWrap}>
      <View style={kit.fieldHead}>
        <Text style={text.caption}>{label}</Text>
        <View style={kit.fieldActions}>
          {secure ? (
            <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
              <Text style={kit.action}>{hidden ? "SHOW" : "HIDE"}</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={value ? () => onChangeText("") : paste}
            hitSlop={8}
          >
            <Text style={kit.action}>{value ? "CLEAR" : "PASTE"}</Text>
          </Pressable>
        </View>
      </View>
      <TextInput
        style={[kit.input, multiline && kit.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        multiline={multiline}
        secureTextEntry={hidden}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
    </View>
  );
}

// ---------- choices ----------

export const ChipRow = ({ children }: { children: ReactNode }) => (
  <View style={kit.chips}>{children}</View>
);

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[kit.chip, active && kit.chipOn]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[kit.chipTxt, active && kit.chipTxtOn]}>{label}</Text>
    </Pressable>
  );
}

// ---------- buttons ----------

export const ButtonRow = ({ children }: { children: ReactNode }) => (
  <View style={kit.btnRow}>{children}</View>
);

export function ActionButton({
  label,
  onPress,
  busy = false,
  disabled = false,
  ghost = false,
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
  ghost?: boolean;
}) {
  const off = busy || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={[
        ghost ? kit.btnGhost : [globalStyles.primaryBtn, kit.btn],
        off && kit.btnOff,
      ]}
    >
      <Text style={ghost ? kit.btnGhostTxt : globalStyles.primaryBtnTxt}>
        {busy ? "WORKING…" : label}
      </Text>
    </Pressable>
  );
}

export function CopyButton({ text: value }: { text: string }) {
  const [done, setDone] = useState(false);
  const press = async () => {
    await writeClipboardText(value);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <Pressable onPress={press} hitSlop={8}>
      <Text style={kit.action}>{done ? "COPIED" : "COPY"}</Text>
    </Pressable>
  );
}

// ---------- results ----------

// one line: LABEL  value  COPY
export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={kit.row}>
      <Text style={kit.rowLabel}>{label}</Text>
      <Text style={kit.rowValue} selectable>
        {value}
      </Text>
      <CopyButton text={value} />
    </View>
  );
}

// a box for longer output (several lines), copy button in the header
export function OutputBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={kit.block}>
      <View style={kit.blockHead}>
        <Text style={text.caption}>{label}</Text>
        <CopyButton text={value} />
      </View>
      <Text style={kit.blockText} selectable>
        {value}
      </Text>
    </View>
  );
}

const TONES = {
  ok: { glyph: "✓", color: Colors.success },
  warn: { glyph: "▲", color: Colors.warning },
  error: { glyph: "✕", color: Colors.danger },
  info: { glyph: "●", color: Colors.info },
} as const;

// glyph + words, never colour alone
export function Status({
  tone,
  children,
}: {
  tone: keyof typeof TONES;
  children: ReactNode;
}) {
  const { glyph, color } = TONES[tone];
  return (
    <Text style={[kit.status, { color }]}>
      {glyph} {children}
    </Text>
  );
}

export const Sub = ({ children }: { children: string }) => (
  <Text style={kit.sub}>{`// ${children}`}</Text>
);

export const Hint = ({ children }: { children: ReactNode }) => (
  <Text style={kit.hint}>{children}</Text>
);
