import { useState } from "react";
import { View } from "react-native";

import { Colors } from "@/constants/Colors";
import { parseColor, toHex, toHslString, toRgbString } from "../logic/color";
import { Field, ResultRow, Status, Stack } from "../toolKit";

export default function ColorPanel() {
  const [input, setInput] = useState("#1E90FF");
  const rgb = parseColor(input);

  return (
    <Stack>
      <Field
        label="HEX · RGB · HSL"
        value={input}
        onChangeText={setInput}
        placeholder="#1E90FF"
      />
      {rgb ? (
        <>
          <View
            style={{
              height: 44,
              backgroundColor: toHex(rgb),
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          />
          <ResultRow label="HEX" value={toHex(rgb)} />
          <ResultRow label="RGB" value={toRgbString(rgb)} />
          <ResultRow label="HSL" value={toHslString(rgb)} />
        </>
      ) : input.trim() ? (
        <Status tone="error">
          TRY #1E90FF · rgb(30, 144, 255) · hsl(210, 100%, 56%)
        </Status>
      ) : null}
    </Stack>
  );
}
