import { useEffect, useState, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle, type TextStyle } from "react-native";

import CtosText from "@/components/CtosText";
import CtosPressable from "@/components/ctos/CtosPressable";
import globalStyles from "@/style/globalStyles";
import Corners from "./Corners";

type Props = {
  /** shown as "// TITLE" in the header row */
  title?: string;
  /** anything on the right of the header */
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  isDanger?: boolean;
  /** change this value (a counter, a timestamp) to flash the corner marks green once, e.g. after a save */
  pulseKey?: string | number;
  children?: ReactNode;
};

// The standard ctOS panel: square card, HUD top line, corner marks and optional "// TITLE" header.
export default function Panel({
  title,
  right,
  onPress,
  style,
  titleStyle,
  isDanger,
  pulseKey,
  children,
}: Props) {
  const [seenKey, setSeenKey] = useState(pulseKey);
  const [flash, setFlash] = useState(false);
  if (pulseKey !== seenKey) {
    setSeenKey(pulseKey);
    setFlash(true);
  }
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(t);
  }, [flash]);

  const header =
    title || right ? (
      <View style={[globalStyles.cardHead, { marginBottom: 8 }]}>
        {title ? (
          <CtosText
            style={[globalStyles.sectionLabel, titleStyle]}
          >{`// ${title}`}</CtosText>
        ) : (
          <View />
        )}
        {right}
      </View>
    ) : null;

  const body = (
    <>
      {header}
      {children}
      <Corners isDanger={isDanger} flash={flash} />
    </>
  );

  return onPress ? (
    <CtosPressable style={[globalStyles.card, style]} onPress={onPress}>
      {body}
    </CtosPressable>
  ) : (
    <View style={[globalStyles.card, style]}>{body}</View>
  );
}
