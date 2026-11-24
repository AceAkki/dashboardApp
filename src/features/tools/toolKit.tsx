import { ComponentProps, useState, type ReactNode } from "react";
import { ScrollView, Text, View, useWindowDimensions, type TextInputProps } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import Button from "@/components/ctos/Button";
import ButtonRow from "@/components/ctos/ButtonRow";
import Chip from "@/components/ctos/Chip";
import CtosScreen from "@/components/ctos/CtosScreen";
import CtosPressable from "@/components/ctos/CtosPressable";
import Field from "@/components/ctos/Field";
import TextAction from "@/components/ctos/TextAction";
import CtosText from "@/components/CtosText";
import { Colors } from "@/constants/Colors";
import { APP_TAG } from "@/global/appInfo";
import { hitSlop, text } from "@/style/globalStyles";
import globalStyles from "@/style/globalStyles";
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
  scroll
}: {
  title: string;
  children: ReactNode;
  scroll?: boolean
}) {
  const router = useRouter();
  // const goBack = () => router.canGoBack() ? router.back() : router.replace("/Tools");
  const goBack = () => router.replace("/Tools");

  const ToolScreenHeader = <View>
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

  return (
    <CtosScreen>
      {scroll ? <ScrollView
        contentContainerStyle={kit.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {ToolScreenHeader}
        {children}
      </ScrollView>
      :
      <View style={{ flex: 1, padding: 16, paddingBottom: 0 }}>
        {ToolScreenHeader}
        {children}
      </View>
      }
    </CtosScreen>
  );
}

// ---------- thin wrappers: the old tool API on top of the shared components ----------

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

// Shared Field with a PASTE button (CLEAR once there is text): typing on a phone is slow.
export function ToolField({ label, value, onChangeText, placeholder, multiline, secure, keyboardType }: FieldProps) {
  const [hidden, setHidden] = useState(!!secure);

  const paste = async () => {
    try {
      onChangeText(await Clipboard.getStringAsync());
    } catch {
      // clipboard not available: nothing to paste
    }
  };

  return (
    <Field
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      secureTextEntry={hidden}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      headerRight={
        <View style={kit.fieldActions}>
          {secure ? <TextAction label={hidden ? "SHOW" : "HIDE"} onPress={() => setHidden((h) => !h)} /> : null}
          <TextAction label={value ? "CLEAR" : "PASTE"} onPress={value ? () => onChangeText("") : paste} />
        </View>
      }
    />
  );
}

// same props the panels always used (`active`), on the shared Chip
export const ToolChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Chip label={label} selected={active} onPress={onPress} />
);

// busy -> loading, ghost -> secondary; each button takes an equal share of its ButtonRow
export const ActionButton = ({
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
}) => (
  <Button
    label={label}
    onPress={onPress}
    loading={busy}
    disabled={disabled}
    variant={ghost ? "secondary" : "primary"}
    style={kit.btn}
  />
);

export const Sub = ({ children }: { children: string }) => <Text style={kit.sub}>{`// ${children}`}</Text>;

export { ButtonRow };

// panels import these under the short names
export { ToolField as Field, ToolChip as Chip };
