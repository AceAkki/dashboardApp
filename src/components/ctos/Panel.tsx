import type { ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import CtosText from "@/components/CtosText";
import globalStyles from "@/style/globalStyles";
import Corners from "./Corners";

type Props = {
  /** shown as "// TITLE" in the header row */
  title?: string;
  /** anything on the right of the header */
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

// The standard ctOS panel: square card, HUD top line, corner marks and optional "// TITLE" header.
export default function Panel({ title, right, onPress, style, children }: Props) {
  const header = title || right ? (
    <View style={[globalStyles.cardHead, { marginBottom: 8 }]}>
      {title ? (
        <CtosText style={globalStyles.sectionLabel}>{`// ${title}`}</CtosText>
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
      <Corners />
    </>
  );

  return onPress ? (
    <Pressable style={[globalStyles.card, style]} onPress={onPress}>
      {body}
    </Pressable>
  ) : (
    <View style={[globalStyles.card, style]}>{body}</View>
  );
}
