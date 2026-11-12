import type { ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle, type TextStyle } from "react-native";

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
  titleStyle?: StyleProp<TextStyle>;
  isDanger?: boolean;
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
  children,
}: Props) {
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
      <Corners isDanger={isDanger} />
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
