import { Rect, Text as SvgText } from "react-native-svg";

import { Typography } from "@/constants/Typography";
import { BootCanvas, range, useBootClock, type BootProps } from "./bootKit";

// Three text lines: thin lines draw out first, then the real text flickers on
// and off. Plays video frames 247-266 (~0.7 s at speed 1).
//
//   <GridAppText lines={["xxxx", "xxxxxx xxxxxx", "Grid App"]} />
//
// lines   up to three rows of text (defaults to the video's placeholder text)

const FRAMES = range(247, 266);

// right edge of each thin line while it draws out (frames 247-251)
const LINE_END: Record<number, number[]> = {
  247: [210, 210, 210],
  248: [222, 261, 262],
  249: [222, 298, 263],
  250: [222, 319, 263],
  251: [222, 319, 263],
};
const LINE_Y = [213, 239, 265];
const BASELINE = [218, 244, 271];

type Props = BootProps & { lines?: [string, string, string] | string[] };

export default function GridAppText({
  lines = ["xxxx", "xxxxxx xxxxxx", "Grid App"],
  color = "#fff",
  size,
  style,
  holdLast = false,
  ...clock
}: Props) {
  const i = useBootClock(FRAMES.length, { ...clock, holdLast });
  const k = i < 0 ? -1 : FRAMES[i];

  return (
    <BootCanvas size={size} style={style}>
      {k >= 247 && k <= 251 &&
        LINE_END[k].map((end, r) => (
          <Rect key={r} x={165} y={LINE_Y[r]} width={end - 164} height={2} fill={color} opacity={0.8} />
        ))}

      {/* from 254 on the text is on for even frames, off for odd ones */}
      {k >= 254 && k % 2 === 0 &&
        lines.slice(0, 3).map((text, r) => (
          <SvgText
            key={r}
            x={164}
            y={BASELINE[r]}
            fontSize={22}
            fontFamily={Typography.secondary_medium}
            fill={color}
          >
            {text}
          </SvgText>
        ))}
    </BootCanvas>
  );
}
