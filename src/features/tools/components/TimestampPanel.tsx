import { useMemo, useState } from "react";

import { describeTime, parseTimeInput } from "../logic/timestamp";
import { ActionButton, Field, Hint, ResultRow, Status, ToolPanel } from "../toolKit";

export default function TimestampPanel() {
  const [input, setInput] = useState("");
  const date = useMemo(() => parseTimeInput(input), [input]);

  return (
    <ToolPanel title="TIMESTAMP CONVERTER">
      <Field
        label="UNIX TIME OR DATE"
        value={input}
        onChangeText={setInput}
        placeholder="1700000000 · 2026-11-02 14:30"
        keyboardType="numbers-and-punctuation"
      />
      <ActionButton ghost label="USE NOW" onPress={() => setInput(String(Math.floor(Date.now() / 1000)))} />
      {input.trim() && !date ? <Status tone="error">CAN'T READ THAT AS A TIME</Status> : null}
      {date ? describeTime(date).map((r) => <ResultRow key={r.label} label={r.label} value={r.value} />) : null}
      {!input.trim() ? <Hint>SECONDS, MILLISECONDS OR A DATE LIKE 2026-11-02 14:30. SECONDS VS MILLISECONDS IS DETECTED.</Hint> : null}
    </ToolPanel>
  );
}
