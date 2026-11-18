import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { pad } from "@/global/dateFormat";
import { fontSize, text } from "@/style/globalStyles";
import Button from "./Button";
import ButtonRow from "./ButtonRow";
import FieldLabel from "./FieldLabel";
import PickCell from "./PickCell";
import Sheet from "./Sheet";

type Props = {
  /** the time shown as chosen when it opens; 09:00 when there is none */
  initial: Date | null;
  onCancel: () => void;
  onSet: (hour: number, minute: number) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

// Hour grid and minute grid (steps of 5). Everything is visible at once: one tap per choice.
export default function TimePickerSheet({ initial, onCancel, onSet }: Props) {
  const [hour, setHour] = useState(initial ? initial.getHours() : 9);
  const [minute, setMinute] = useState(initial ? initial.getMinutes() : 0);

  return (
    <Sheet title="PICK TIME" onClose={onCancel}>
      <Text style={styles.big}>{`${pad(hour)}:${pad(minute)}`}</Text>

      <View style={styles.group}>
        <FieldLabel>Hour</FieldLabel>
        <View style={styles.grid}>
          {HOURS.map((h) => (
            <View key={h} style={styles.slot}>
              <PickCell label={pad(h)} selected={h === hour} onPress={() => setHour(h)} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <FieldLabel>Minute</FieldLabel>
        <View style={styles.grid}>
          {MINUTES.map((m) => (
            <View key={m} style={styles.slot}>
              <PickCell label={pad(m)} selected={m === minute} onPress={() => setMinute(m)} />
            </View>
          ))}
        </View>
      </View>

      <ButtonRow>
        <Button label="Cancel" variant="secondary" onPress={onCancel} style={styles.flex} />
        <Button label="Set time" onPress={() => onSet(hour, minute)} style={styles.flex} />
      </ButtonRow>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  big: {
    ...text.caption,
    fontFamily: Typography.primary_bold,
    fontSize: fontSize.display_sml,
    letterSpacing: 3,
    color: Colors.primary,
    textAlign: "center",
  },
  group: { gap: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  slot: { width: `${100 / 6}%`, padding: 2 },
  flex: { flex: 1 },
});
