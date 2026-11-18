import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { addDays, dayText, sameDay, startOfDay, timeText } from "@/global/dateFormat";
import { spacing } from "@/style/globalStyles";
import Button from "./Button";
import Chip from "./Chip";
import ChipRow from "./ChipRow";
import DatePickerSheet from "./DatePickerSheet";
import FieldLabel from "./FieldLabel";
import Hint from "./Hint";
import Status from "./Status";
import TextAction from "./TextAction";
import TimePickerSheet from "./TimePickerSheet";

type Props = {
  /** null = no reminder */
  value: Date | null;
  onChange: (next: Date | null) => void;
  /** red message under the pickers */
  error?: string | null;
};

// the quick times, as [hour, minute]
const QUICK_TIMES: [number, number][] = [
  [9, 0],
  [13, 0],
  [18, 0],
  [21, 0],
];
const label = ([h, m]: [number, number]) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

const at = (day: Date, h: number, m: number) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);

// Date and time are chosen separately: quick chips for the common cases, or a ctOS picker for any value.
// Only one half chosen? The other gets a sensible default: 09:00, or today (tomorrow if that time has passed).
export default function ReminderPicker({ value, onChange, error }: Props) {
  const [open, setOpen] = useState<"date" | "time" | null>(null);

  const setDay = (day: Date) => {
    if (value) return onChange(at(day, value.getHours(), value.getMinutes()));
    // no time yet: 09:00, or the next full hour when picking today and 09:00 has passed
    const isToday = sameDay(day, new Date());
    onChange(at(day, isToday ? Math.min(23, Math.max(9, new Date().getHours() + 1)) : 9, 0));
  };

  const setTime = (h: number, m: number) => {
    if (value) return onChange(at(value, h, m));
    const today = startOfDay(new Date());
    const candidate = at(today, h, m);
    onChange(candidate.getTime() > Date.now() ? candidate : at(addDays(today, 1), h, m));
  };

  const today = startOfDay(new Date());
  const days: [string, Date][] = [
    ["Today", today],
    ["Tomorrow", addDays(today, 1)],
    ["Next week", addDays(today, 7)],
  ];

  return (
    <View style={styles.group}>
      <FieldLabel>Reminder</FieldLabel>

      <ChipRow>
        {days.map(([name, day]) => (
          <Chip
            key={name}
            label={name}
            selected={!!value && sameDay(value, day)}
            onPress={() => setDay(day)}
          />
        ))}
      </ChipRow>
      <ChipRow>
        {QUICK_TIMES.map(([h, m]) => (
          <Chip
            key={label([h, m])}
            label={label([h, m])}
            selected={!!value && value.getHours() === h && value.getMinutes() === m}
            onPress={() => setTime(h, m)}
          />
        ))}
      </ChipRow>

      <View style={styles.pair}>
        <View style={styles.flex}>
          <FieldLabel>Date</FieldLabel>
          <Button
            label={value ? dayText(value) : "Pick date"}
            variant="secondary"
            onPress={() => setOpen("date")}
          />
        </View>
        <View style={styles.flex}>
          <FieldLabel>Time</FieldLabel>
          <Button
            label={value ? timeText(value) : "Pick time"}
            variant="secondary"
            onPress={() => setOpen("time")}
          />
        </View>
      </View>

      <View style={styles.summary}>
        <Hint>
          {value ? `REMINDS ${dayText(value)} · ${timeText(value)}` : "PICK A DATE AND A TIME, OR TAP A QUICK CHIP"}
        </Hint>
        {value ? <TextAction label="CLEAR" onPress={() => onChange(null)} /> : null}
      </View>
      {error ? <Status tone="err">{error}</Status> : null}

      {open === "date" ? (
        <DatePickerSheet
          initial={value}
          onCancel={() => setOpen(null)}
          onSet={(day) => {
            setDay(day);
            setOpen(null);
          }}
        />
      ) : null}
      {open === "time" ? (
        <TimePickerSheet
          initial={value}
          onCancel={() => setOpen(null)}
          onSet={(h, m) => {
            setTime(h, m);
            setOpen(null);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  pair: { flexDirection: "row", gap: spacing.md },
  flex: { flex: 1, gap: 6 },
  summary: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
