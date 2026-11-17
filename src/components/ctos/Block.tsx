import { type ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import globalStyles, { spacing } from "@/style/globalStyles";
import Hint from "./Hint";

type Props = { title?: string; hint?: string; right?: ReactNode; children: ReactNode; style?: StyleProp<ViewStyle> };

// inset box with an optional caption (and a right-side action) over its content
export default function Block({ title, hint, right, children, style }: Props) {
  return (
    <View style={[globalStyles.inset, styles.block, style]}>
      {title || right ? (
        <View style={styles.head}>
          {title ? <Text style={globalStyles.textCaption}>{title}</Text> : <View />}
          {right}
        </View>
      ) : null}
      {hint ? <Hint>{hint}</Hint> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { padding: 10, gap: spacing.sm },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
