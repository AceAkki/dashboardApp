import { ComponentProps, useState, type ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type TextInputProps,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import { Colors } from "@/constants/Colors";
import { writeClipboardText } from "@/global/globalFunctions";
import { feedback } from "@/global/useFeedback";
import useAsciiSpinner from "@/global/useAsciiSpinner";
import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import { APP_TAG } from "@/global/appInfo";
import globalStyles, { text } from "@/style/globalStyles";
import kit from "./toolKitStyles";

type IconName = ComponentProps<typeof Ionicons>["name"];
// The small building blocks every tool panel and tool screen is made from.

// ---------- layout ----------

// vertical spacing between the things inside a panel
export const Stack = ({ children }: { children: ReactNode }) => (
  <View style={kit.stack}>{children}</View>
);

// A tile on the Tools tab: big icon, title, one line about it. Tap and the tool opens.
export function ToolTile({
  href,
  title,
  blurb,
  iconName,
}: {
  href: string;
  title: string;
  blurb: string;
  iconName: IconName;
}) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // two per row: screen - screen padding (16 + 16) - gap (10)
  const tileWidth = (width - 32 - 10) / 2;

  return (
    <CtosPressable
      onPress={() => router.push(href as never)}
      style={[kit.tile, { width: tileWidth }]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${blurb}`}
    >
      {/* big faint copy of the icon, cut off by the tile edge */}
      <Ionicons name={iconName} size={92} color={Colors.primary} style={kit.tileMark} />
      <Ionicons name={iconName} size={30} color={Colors.primary} style={kit.tileIcon} />
      <Text style={kit.tileTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={kit.tileBlurb} numberOfLines={2}>
        {blurb}
      </Text>
    </CtosPressable>
  );
}

export function ToolGroup({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <View style={kit.stack}>
      <View style={kit.groupHead}>
        <Text style={globalStyles.sectionLabel}>{`// ${title}`}</Text>
        {count !== undefined ? <Text style={kit.groupCount}>{count}</Text> : null}
      </View>
      <View style={kit.toolGroup}>{children}</View>
    </View>
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
  // const goBack = () => router.canGoBack() ? router.back() : router.replace("/Tools");
  const goBack = () => router.replace("/Tools");

  return (
    <CtosScreen>
      <ScrollView
        contentContainerStyle={kit.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View>
          <CtosPressable onPress={goBack} style={kit.back} hitSlop={8} pressedStyle={{ opacity: 0.6 }}>
            <Ionicons name="chevron-back" size={14} color={Colors.primary} />
            <Text style={kit.backTxt}>TOOLS</Text>
          </CtosPressable>
          {/* Text style={globalStyles.sectionLabel}>{}</Text> */}
          <View style={globalStyles.header}>
            <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Main`}</Text>
            <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
              <CtosText style={[globalStyles.textHeading, { marginTop: 6 }]}>
                {title}
              </CtosText>
            </View>
          </View>
        </View>
        {children}
      </ScrollView>
    </CtosScreen>
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
            <CtosPressable haptic="select" pressedStyle={{ opacity: 0.5 }} onPress={() => setHidden((h) => !h)} hitSlop={8}>
              <Text style={kit.action}>{hidden ? "SHOW" : "HIDE"}</Text>
            </CtosPressable>
          ) : null}
          <CtosPressable
            haptic="select"
            pressedStyle={{ opacity: 0.5 }}
            onPress={value ? () => onChangeText("") : paste}
            hitSlop={8}
          >
            <Text style={kit.action}>{value ? "CLEAR" : "PASTE"}</Text>
          </CtosPressable>
        </View>
      </View>
      <FocusInput
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
    <CtosPressable
      haptic="select"
      onPress={onPress}
      style={[kit.chip, active && kit.chipOn]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[kit.chipTxt, active && kit.chipTxtOn]}>{label}</Text>
    </CtosPressable>
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
  const spin = useAsciiSpinner(busy);
  return (
    <CtosPressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={[
        ghost ? kit.btnGhost : [globalStyles.primaryBtn, kit.btn],
        off && kit.btnOff,
      ]}
      pressedStyle={ghost ? undefined : { opacity: 0.7 }}
    >
      <Text style={ghost ? kit.btnGhostTxt : globalStyles.primaryBtnTxt}>
        {busy ? `${spin} WORKING` : label}
      </Text>
    </CtosPressable>
  );
}

export function CopyButton({ text: value }: { text: string }) {
  const [done, setDone] = useState(false);
  const press = async () => {
    await writeClipboardText(value);
    feedback.success();
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <CtosPressable haptic="none" pressedStyle={{ opacity: 0.5 }} onPress={press} hitSlop={8}>
      <Text style={kit.action}>{done ? "COPIED" : "COPY"}</Text>
    </CtosPressable>
  );
}

// ---------- results ----------

// one line: LABEL  value  COPY
// reveal: the value types itself in (scramble). Only for results that appear once, after a button
// press; leave it off where the value changes while typing.
export function ResultRow({
  label,
  value,
  reveal = false,
}: {
  label: string;
  value: string;
  reveal?: boolean;
}) {
  return (
    <View style={kit.row}>
      <Text style={kit.rowLabel}>{label}</Text>
      {reveal && value.length <= 64 ? (
        <CtosText style={kit.rowValue} selectable duration={450}>
          {value}
        </CtosText>
      ) : (
        <Text style={kit.rowValue} selectable>
          {value}
        </Text>
      )}
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
