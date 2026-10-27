import { Circle, G, Line, Polygon, Rect } from "react-native-svg";

import { BootCanvas, STROKE, range, useBootClock, type BootProps } from "./bootKit";

// The finale: a circle settles, a hexagon "cube" flickers in and out of it in
// different line patterns, then locks in and holds. Plays video frames
// 1129-1175 (~1.6 s at speed 1). Holds the last frame by default.
//
//   <CircleCube onDone={() => ...} />

const FRAMES = range(1129, 1175);

const CX = 241;
const CY = 236.5;

// cube corners
const TOP: P = [241, 187.5];
const UR: P = [292, 208];
const LR: P = [292, 262];
const BOT: P = [241, 284.5];
const LL: P = [190, 262];
const UL: P = [190, 208];
type P = [number, number];

type Cube = "full" | "star" | "half" | "bowtie" | null;

// per frame: [ring radius or 0, cube pattern, opacity]
const plan = (k: number): [number, Cube, number] => {
  if (k <= 1135) {
    const R = [106, 106, 104, 102, 98.5, 94, 89][k - 1129];
    return [R, null, k <= 1132 ? 0.85 : 0.96];
  }
  if (k === 1136) return [0, "full", 0.85];
  if (k <= 1138) return [89, "full", 0.9];
  if (k === 1139) return [89, "star", 0.9];
  if (k <= 1141) return [0, "half", 0.87];
  if (k === 1142) return [89, "half", 0.92];
  if (k <= 1144) return [89, null, 1];
  if (k <= 1146) return [89, "bowtie", 0.9];
  if (k === 1147) return [89, null, 1];
  return [89, "full", 1];
};

const seg = (a: P, b: P, color: string, key: string) => (
  <Line key={key} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={STROKE} />
);

type Props = BootProps & { blip?: boolean };

export default function CircleCube({ color = "#fff", size, style, holdLast = true, blip = true, ...clock }: Props) {
  const i = useBootClock(FRAMES.length, { ...clock, holdLast });
  const k = i < 0 ? -1 : FRAMES[i];
  if (k < 0) return <BootCanvas size={size} style={style} />;

  const [R, cube, opacity] = plan(k);
  const hexLine = (key: string, pts: P[]) => (
    <Polygon key={key} points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={STROKE} />
  );

  return (
    <BootCanvas size={size} style={style}>
      <G opacity={opacity}>
        {R > 0 && <Circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth={STROKE} />}

        {(cube === "full" || cube === "half" || cube === "star") &&
          hexLine("hex", [TOP, UR, LR, BOT, LL, UL])}
        {cube === "bowtie" && (
          <>
            {seg(UL, LL, color, "ls")}
            {seg(UR, LR, color, "rs")}
          </>
        )}

        {cube !== null && cube !== "star" && seg(TOP, BOT, color, "v")}
        {cube === "star" && (
          <>
            {seg(TOP, BOT, color, "v")}
            {seg(UL, LR, color, "s1")}
            {seg(LL, UR, color, "s2")}
          </>
        )}
        {(cube === "full" || cube === "bowtie") && (
          <>
            {seg(UL, BOT, color, "d1")}
            {seg(LL, TOP, color, "d2")}
            {seg(UR, BOT, color, "d3")}
            {seg(LR, TOP, color, "d4")}
          </>
        )}
      </G>

      {/* grey blip flashing at the lower right (frames 1156-1158) */}
      {blip && k >= 1156 && k <= 1158 && (
        <Rect x={314} y={307} width={16} height={17} fill="#646464" />
      )}
    </BootCanvas>
  );
}
