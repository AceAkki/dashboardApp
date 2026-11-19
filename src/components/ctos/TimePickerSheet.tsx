import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { pad } from "@/global/dateFormat";
import { fontSize, text } from "@/style/globalStyles";
import CtosText from "../CtosText";
import Button from "./Button";
import ButtonRow from "./ButtonRow";
import Chip from "./Chip";
import ChipRow from "./ChipRow";
import Drum, { DRUM_ITEM } from "./Drum";
import FieldLabel from "./FieldLabel";
import Sheet from "./Sheet";

type Props = {
  /** the time shown as chosen when it opens; 09:00 when there is none */
  initial: Date | null;
  onCancel: () => void;
  onSet: (hour: number, minute: number) => void;
};

const LAST = 24 * 60 - 1; // add-chips stop at 23:59 instead of wrapping into the next day

// Two scrolling columns (hours 00–23, minutes 00–59) that snap to a row, plus quick "add" chips.
// Every minute is reachable; the big time above follows the columns live.
export default function TimePickerSheet({ initial, onCancel, onSet }: Props) {
  const [hour, setHour] = useState(initial ? initial.getHours() : 9);
  const [minute, setMinute] = useState(initial ? initial.getMinutes() : 0);

  const goTo = (total: number) => {
    const t = Math.max(0, Math.min(LAST, total));
    setHour(Math.floor(t / 60));
    setMinute(t % 60);
  };
  const add = (mins: number) => goTo(hour * 60 + minute + mins);
  const now = () => {
    const d = new Date();
    goTo(d.getHours() * 60 + d.getMinutes());
  };

  return (
    <Sheet title="PICK TIME" onClose={onCancel}>
      <View style={styles.timeRow}>
        <CtosText
          style={[styles.big, styles.bigger]}
        >{`${pad(hour)}`}</CtosText>
        <Text style={[styles.big, styles.bigger]}>{`:`}</Text>
        <CtosText
          style={[styles.big, styles.bigger]}
        >{`${pad(minute)}`}</CtosText>
      </View>

      <View style={styles.drums}>
        {/* the band marking the chosen row, behind and across both columns */}
        <View pointerEvents="none" style={styles.band} />
        <Drum label="Hour" count={24} value={hour} onChange={setHour} />
        <Text style={styles.colon}>:</Text>
        <Drum label="Minute" count={60} value={minute} onChange={setMinute} />
      </View>
      <View style={styles.heads}>
        <FieldLabel>HH</FieldLabel>
        <FieldLabel>MM</FieldLabel>
      </View>

      <View style={styles.group}>
        <FieldLabel>Add</FieldLabel>
        <ChipRow>
          <Chip size="sm" label="+5 min" onPress={() => add(5)} />
          <Chip size="sm" label="+15" onPress={() => add(15)} />
          <Chip size="sm" label="+30" onPress={() => add(30)} />
          <Chip size="sm" label="+1 h" onPress={() => add(60)} />
          <Chip size="sm" label="Now" onPress={now} />
        </ChipRow>
      </View>

      <ButtonRow>
        <Button
          label="Cancel"
          variant="secondary"
          onPress={onCancel}
          style={styles.flex}
        />
        <Button
          label="Set time"
          onPress={() => onSet(hour, minute)}
          style={styles.flex}
        />
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
  bigger: {
    fontSize: fontSize.display,
  },
  drums: { flexDirection: "row", alignItems: "center" },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: DRUM_ITEM * 2,
    height: DRUM_ITEM,
    backgroundColor: Colors.primarySoft,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
  },
  colon: {
    fontFamily: Typography.primary_bold,
    fontSize: fontSize.display_sml,
    color: Colors.primary,
    width: 24,
    textAlign: "center",
  },
  heads: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -4,
  },
  group: { gap: 8 },
  flex: { flex: 1 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
