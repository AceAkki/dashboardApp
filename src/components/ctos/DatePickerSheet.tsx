import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { MONTHS, sameDay, startOfDay } from "@/global/dateFormat";
import { fontSize, spacing, text } from "@/style/globalStyles";
import Button from "./Button";
import ButtonRow from "./ButtonRow";
import CtosPressable from "./CtosPressable";
import PickCell from "./PickCell";
import Sheet from "./Sheet";

type Props = {
  /** the day shown as chosen when it opens, if any */
  initial: Date | null;
  onCancel: () => void;
  onSet: (day: Date) => void;
};

const LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// Month grid. Days before today can't be picked: a reminder has to be in the future.
// Mount it only while open, so it starts from `initial` each time.
export default function DatePickerSheet({ initial, onCancel, onSet }: Props) {
  const [today] = useState(() => startOfDay(new Date()));
  const start = initial && initial >= today ? initial : today;
  const [view, setView] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [picked, setPicked] = useState<Date | null>(initial && initial >= today ? startOfDay(initial) : null);

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const step = (by: number) => {
    const d = new Date(view.y, view.m + by, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Sheet title="PICK DATE" onClose={onCancel}>
      <View style={styles.head}>
        <CtosPressable
          haptic="select"
          disabled={isCurrentMonth}
          onPress={() => step(-1)}
          accessibilityLabel="Previous month"
          style={isCurrentMonth && { opacity: 0.3 }}
        >
          <Text style={styles.arrow}>‹</Text>
        </CtosPressable>
        <Text style={styles.month}>{`${MONTHS[view.m]} ${view.y}`}</Text>
        <CtosPressable haptic="select" onPress={() => step(1)} accessibilityLabel="Next month">
          <Text style={styles.arrow}>›</Text>
        </CtosPressable>
      </View>

      <View style={styles.grid}>
        {LETTERS.map((l, i) => (
          <View key={`w${i}`} style={styles.slot}>
            <Text style={styles.letter}>{l}</Text>
          </View>
        ))}
        {cells.map((n, i) => {
          if (n === null) return <View key={`b${i}`} style={styles.slot} />;
          const day = new Date(view.y, view.m, n);
          return (
            <View key={n} style={styles.slot}>
              <PickCell
                label={String(n)}
                disabled={day < today}
                marked={sameDay(day, today)}
                selected={!!picked && sameDay(day, picked)}
                onPress={() => setPicked(day)}
              />
            </View>
          );
        })}
      </View>

      <ButtonRow>
        <Button label="Cancel" variant="secondary" onPress={onCancel} style={styles.flex} />
        <Button label="Set date" disabled={!picked} onPress={() => picked && onSet(picked)} style={styles.flex} />
      </ButtonRow>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  arrow: { fontSize: fontSize.xl, color: Colors.primary, paddingHorizontal: spacing.md },
  month: { ...text.caption, color: Colors.textPrimary, letterSpacing: 2, fontSize: fontSize.sm + 1 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  slot: { width: `${100 / 7}%`, padding: 2, minHeight: 20 },
  letter: { ...text.caption, textAlign: "center", color: Colors.textMuted, fontSize: fontSize.xs },
  flex: { flex: 1 },
});
