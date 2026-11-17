import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize } from "@/style/globalStyles";
import Block from "./Block";
import CopyButton from "./CopyButton";

// a box for longer output (several lines), copy button in the header
export default function OutputBlock({ label, value }: { label: string; value: string }) {
  return (
    <Block title={label} right={<CopyButton text={value} />}>
      <Text style={styles.body} selectable>
        {value}
      </Text>
    </Block>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: Typography.primary,
    color: Colors.primary,
    fontSize: fontSize.sm + 1,
    lineHeight: 18,
  },
});
