import { G, Line, Polygon, Text as SvgText } from "react-native-svg";

import { Typography } from "@/constants/Typography";
import { BootCanvas, STROKE, range, rad, useBootClock, type BootProps } from "./bootKit";

// A hexagon that grows, spins to a stop while its label scrambles into the
// final word, flickers, then sprouts spokes. Plays video frames 324-368
// (~1.5 s at speed 1).
//
//   <HexLogin label="Login" />
//
// label   the word the scramble settles on (default "Login"). The scramble
//         steps are the video's; they're generated from the word you pass, so
//         any label works. Keep it short: it sits inside the hexagon.

const FRAMES = range(324, 368);

const CX = 241;
const CY = 237;

// hexagon vertex-angle (degrees) for frames 330-356: eases from 0 to 90
const SPIN = [
  0, 6.9, 13.8, 20.4, 26.2, 32.2, 37.9, 43.2, 48.2, 53.2, 57.6, 62.1, 65.7, 69.4,
  72.7, 75.7, 78.5, 81, 82.9, 84.9, 86.5, 87.8, 88.9, 89.4, 89.9, 90, 90,
];

// the video's scramble steps for the first 17 label frames (330-346)
const STEPS = [
  "D", "Mn", "Vah", "Yah", "Yeyg", "Laowk", "Kieufnv", "Hywhfkf", "Jnashdger",
  "Lxrqgeukf", "Lohnskxm", "Logxcfdga", "Logirejvb", "Loginvbs", "Loginma",
  "Logindf", "Loginv",
];

// inner end of the spokes in frames 363-368 (they pull back to the hexagon)
const SPOKE_IN = [8, 8, 24, 38, 54, 84];

const POOL = "abcdefghijklmnopqrstuvwxyz";

// scramble text for frame step 0-16: the first characters have locked onto the
// label, the rest are filler. "Login" uses the video's exact steps.
const stepText = (label: string, step: number) => {
  if (label === "Login") return STEPS[step];
  const locked = Math.floor((step / (STEPS.length - 1)) * label.length);
  const total = Math.max(locked, Math.min(label.length, STEPS[step].length));
  let out = label.slice(0, locked);
  while (out.length < total) out += POOL[(out.length * 7 + step * 3) % POOL.length];
  return out;
};

type Props = BootProps & { label?: string };

export default function HexLogin({ label = "Login", color = "#fff", size, style, holdLast = false, ...clock }: Props) {
  const i = useBootClock(FRAMES.length, { ...clock, holdLast });
  const k = i < 0 ? -1 : FRAMES[i];

  // hexagon radius / rotation / label for this frame
  let R = 0;
  let rot = 0;
  let text: string | null = null;
  let hexOn = false;

  if (k >= 327 && k <= 329) {
    R = [43, 57, 71][k - 327];
    hexOn = true;
  } else if (k >= 330) {
    R = 85;
    rot = SPIN[Math.min(k - 330, SPIN.length - 1)];
    hexOn = k !== 357 && k !== 360;
    if (k <= 346) text = stepText(label, k - 330);
    else if (k <= 357) text = label;
  }

  const verts = Array.from({ length: 6 }, (_, v) => {
    const a = rad(rot + 60 * v);
    return `${CX + R * Math.cos(a)},${CY + R * Math.sin(a)}`;
  }).join(" ");

  return (
    <BootCanvas size={size} style={style}>
      {/* three thin crossing lines (frames 324-326) */}
      {k >= 324 && k <= 326 && (
        <G opacity={0.65}>
          <Line x1={240} y1={172} x2={240} y2={306} stroke={color} strokeWidth={STROKE} />
          <Line x1={180} y1={204.5} x2={300} y2={273.5} stroke={color} strokeWidth={STROKE} />
          <Line x1={180} y1={273.5} x2={300} y2={204.5} stroke={color} strokeWidth={STROKE} />
        </G>
      )}

      {hexOn && <Polygon points={verts} fill="none" stroke={color} strokeWidth={STROKE} />}

      {text !== null && (
        <SvgText
          x={178}
          y={245.5}
          fontSize={22}
          fontFamily={Typography.secondary_medium}
          fill={color}
        >
          {text}
        </SvgText>
      )}

      {/* spokes through the six corners, pulling back and fading (363-368) */}
      {k >= 363 && (
        <G opacity={k === 368 ? 0.75 : 1}>
          {[90, 30, -30, -90, -150, 150].map((deg) => {
            const a = rad(deg);
            const rIn = SPOKE_IN[k - 363];
            const rOut = Math.abs(deg) === 90 ? 111 : 115;
            return (
              <Line
                key={deg}
                x1={CX + rIn * Math.cos(a)}
                y1={CY + rIn * Math.sin(a)}
                x2={CX + rOut * Math.cos(a)}
                y2={CY + rOut * Math.sin(a)}
                stroke={color}
                strokeWidth={STROKE}
              />
            );
          })}
        </G>
      )}
    </BootCanvas>
  );
}
