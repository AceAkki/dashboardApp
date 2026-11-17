import { StyleSheet, Text, View } from "react-native";

import CtosText from "@/components/CtosText";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize, insetBase, spacing, text } from "@/style/globalStyles";
import CopyButton from "./CopyButton";

// one line: LABEL  value  COPY
// reveal: the value types itself in. Only for results that appear once, after a button press.
export default function ResultRow({
  label,
  value,
  reveal = false,
}: {
  label: string;
  value: string;
  reveal?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {reveal && value.length <= 64 ? (
        <CtosText style={styles.value} selectable duration={450}>
          {value}
        </CtosText>
      ) : (
        <Text style={styles.value} selectable>
          {value}
        </Text>
      )}
      <CopyButton text={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { ...insetBase, padding: 10, flexDirection: "row", alignItems: "center", gap: spacing.md - 2 },
  label: { ...text.caption, width: 88 },
  value: {
    flex: 1,
    fontFamily: Typography.primary,
    color: Colors.textPrimary,
    fontSize: fontSize.sm + 1,
  },
});
