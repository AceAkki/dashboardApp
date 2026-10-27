import { useEffect, useState, type ReactNode } from "react";
import { Pressable } from "react-native";
import Svg, {
  Circle,
  Line,
  Polygon,
  Polyline,
  Rect,
  Text as SvgText,
} from "react-native-svg";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

// Line-art boot animation built from a frame-by-frame study of the reference
// video: white outlines (hexagons, triangles, circles, diamonds), solid loading
// bars, placeholder "xxxx" text, "System Loading" / "Initializing" labels and
// small grey blips, ending on a circle around a hexagon "cube".
//
//   <BootAnimation onDone={() => setBooted(true)} />
//
// onDone     called when the sequence ends, or when the screen is tapped
// speed      1 = the reference timing (about 40 s). 2 = twice as fast, etc.
// color      line / text colour (default white)
// background screen colour (default your app background)
//
// Timing is matched to roughly 0.3 s, so treat it as a close recreation,
// not a frame-exact copy. The whole sequence is the SCENES list below:
// each entry is [start time in seconds, what to draw].

const W = 480; // drawing space (matches the video's proportions)
const H = 490;
const CX = W / 2;
const CY = H / 2;
const SW = 1.8; // line width
const END = 40.4; // seconds, when onDone fires

type Draw = (lt: number, c: string) => ReactNode;

// ---------------------------------------------------------------- helpers
const rad = (d: number) => (d * Math.PI) / 180;

const hexPoints = (R: number, rot = 0) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = rad(-90 + 60 * k + rot);
    return [CX + R * Math.cos(a), CY + R * Math.sin(a)] as const;
  });

const str = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y]) => `${x},${y}`).join(" ");

const poly = (pts: readonly (readonly [number, number])[], c: string) => (
  <Polygon points={str(pts)} fill="none" stroke={c} strokeWidth={SW} />
);

const line = (x1: number, y1: number, x2: number, y2: number, c: string, k?: string | number) => (
  <Line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={SW} />
);

const circle = (r: number, c: string) => (
  <Circle cx={CX} cy={CY} r={r} fill="none" stroke={c} strokeWidth={SW} />
);

const diamond = (h: number, c: string, dx = 0) =>
  poly(
    [
      [CX + dx, CY - h],
      [CX + dx + h, CY],
      [CX + dx, CY + h],
      [CX + dx - h, CY],
    ],
    c,
  );

const hex = (R: number, c: string, rot = 0) => poly(hexPoints(R, rot), c);

const triDown = (hw: number, h: number, c: string, dy = 0) =>
  poly(
    [
      [CX - hw, CY - h / 2 + dy],
      [CX + hw, CY - h / 2 + dy],
      [CX, CY + h / 2 + dy],
    ],
    c,
  );

const triUp = (hw: number, h: number, c: string, dy = 0) =>
  poly(
    [
      [CX - hw, CY + h / 2 + dy],
      [CX + hw, CY + h / 2 + dy],
      [CX, CY - h / 2 + dy],
    ],
    c,
  );

const cross = (h: number, c: string) => (
  <>
    {line(CX - h, CY - h, CX + h, CY + h, c, "a")}
    {line(CX + h, CY - h, CX - h, CY + h, c, "b")}
  </>
);

const lerp = (a: readonly [number, number], b: readonly [number, number], t: number) =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as const;

// grey blip that flashes off to the lower right of centre
const blip: Draw = () => (
  <Rect x={CX + 74} y={CY + 58} width={16} height={16} fill="#7a7a7a" />
);

// stacked white loading bars
const bars = (w: number, c: string) => (
  <>
    {[0, 26, 52].map((i) => (
      <Rect key={i} x={160} y={204 + i} width={w} height={22} fill={c} />
    ))}
  </>
);

// text lines starting at x, one per row
const lines = (rows: string[], x: number, y: number, gap: number, size: number, c: string, spacing = 0, bold = false) => (
  <>
    {rows.map((r, i) => (
      <SvgText
        key={i}
        x={x}
        y={y + i * gap}
        fontSize={size}
        letterSpacing={spacing}
        fontFamily={bold ? Typography.secondary_semibold : Typography.secondary}
        fill={c}
      >
        {r}
      </SvgText>
    ))}
  </>
);

// "System Loading" / "Initializing" block: small square, two bars, a label
const logo = (label: string, w1: number, w2: number, showText: boolean, c: string) => (
  <>
    <Rect x={160} y={178} width={28} height={24} fill={c} />
    {w1 > 0 && <Rect x={160} y={206} width={w1} height={20} fill={c} />}
    {showText && (
      <SvgText
        x={162}
        y={250}
        fontSize={22}
        fontFamily={Typography.secondary_semibold}
        fill={c}
      >
        {label}
      </SvgText>
    )}
    {w2 > 0 && <Rect x={160} y={258} width={w2} height={18} fill={c} />}
  </>
);

const hexLabel = (label: string, rot: number, squash: number, c: string) => {
  const pts = hexPoints(84, rot).map(([x, y]) => [CX + (x - CX) * squash, y] as const);
  return (
    <>
      {poly(pts, c)}
      <SvgText
        x={CX}
        y={CY + 7}
        fontSize={20}
        textAnchor="middle"
        fontFamily={Typography.secondary}
        fill={c}
      >
        {label}
      </SvgText>
    </>
  );
};

const hexSpokes = (c: string) => (
  <>
    {hex(76, c)}
    {Array.from({ length: 6 }, (_, k) => {
      const a = rad(-90 + 60 * k);
      return line(
        CX + 18 * Math.cos(a),
        CY + 18 * Math.sin(a),
        CX + 100 * Math.cos(a),
        CY + 100 * Math.sin(a),
        c,
        k,
      );
    })}
  </>
);

// hexagon "cube" faces drawn inside the final circle
const CUBE = {
  top: [CX, CY - 48],
  ur: [CX + 51, CY - 24],
  lr: [CX + 51, CY + 24],
  bottom: [CX, CY + 48],
  ll: [CX - 51, CY + 24],
  ul: [CX - 51, CY - 24],
} as const;

const cube = (c: string, full: boolean) => (
  <>
    {full && poly([CUBE.top, CUBE.ur, CUBE.lr, CUBE.bottom, CUBE.ll, CUBE.ul], c)}
    {full && line(CUBE.top[0], CUBE.top[1], CUBE.bottom[0], CUBE.bottom[1], c, "v")}
    {line(CUBE.ul[0], CUBE.ul[1], CUBE.bottom[0], CUBE.bottom[1], c, "d1")}
    {line(CUBE.ll[0], CUBE.ll[1], CUBE.top[0], CUBE.top[1], c, "d2")}
    {line(CUBE.ur[0], CUBE.ur[1], CUBE.bottom[0], CUBE.bottom[1], c, "d3")}
    {line(CUBE.lr[0], CUBE.lr[1], CUBE.top[0], CUBE.top[1], c, "d4")}
  </>
);

// ---------------------------------------------------------------- scenes
const B: Draw = () => null;

const SCENES: [number, Draw][] = [
  [0.0, B],
  [0.33, blip],
  [0.5, B],
  [0.67, (_, c) => lines(["XXXXXXXX", "XXXXX", "XX"], 164, 221, 26, 20, c, 5)],
  [0.83, (_, c) => bars(6, c)],
  [1.0, (_, c) => bars(140, c)],
  [1.17, (_, c) => <>{bars(174, c)}{diamond(52, c)}</>],
  [1.33, (_, c) => <>{diamond(38, c, -14)}{diamond(38, c, 14)}{cross(60, c)}</>],
  [1.5, B],
  [1.83, (_, c) => <>{triDown(92, 150, c, -10)}{diamond(104, c)}</>],
  [2.0, (_, c) => <>{triDown(92, 170, c)}{circle(73, c)}</>],
  [2.17, B],

  // "System Loading"
  [3.0, (_, c) => logo("System Loading", 0, 0, true, c)],
  [3.17, (_, c) => logo("System Loading", 94, 128, true, c)],
  [3.67, (_, c) => logo("", 114, 148, false, c)],
  [3.83, B],

  [8.0, (_, c) => cross(74, c)],
  [8.33, (_, c) => lines(["xxxx", "xxxxxx xxxxxx", "Grid App"], 162, 216, 26, 18, c)],
  [9.0, (_, c) => triDown(72, 126, c)],
  [9.33, B],
  [9.67, (_, c) => (
    <>
      {triDown(72, 126, c)}
      {line(CX - 36, CY - 63, CX - 8, CY + 6, c, "l")}
      {line(CX + 36, CY - 63, CX + 8, CY + 6, c, "r")}
    </>
  )],
  [10.0, B],

  // hexagon whose label scrambles into "Login"
  [11.0, (_, c) => hexLabel("Yah", 18, 1, c)],
  [11.33, (_, c) => hexLabel("Loginvbs", -12, 1.1, c)],
  [11.67, (_, c) => hexLabel("Login", 0, 1, c)],
  [12.0, (_, c) => hexSpokes(c)],
  [12.33, (_, c) => (
    <>
      {line(CX - 58, CY - 64, CX + 58, CY - 64, c, "t")}
      {line(CX - 66, CY - 46, CX - 24, CY + 56, c, "l")}
      {line(CX + 66, CY - 46, CX + 24, CY + 56, c, "r")}
    </>
  )],
  [12.67, B],

  [16.0, (_, c) => lines(["XXXXXX", "XXX"], 164, 221, 26, 20, c, 5)],
  [16.33, (_, c) => (
    <>
      {[0, 26, 52].map((i) => <Rect key={i} x={160} y={204 + i} width={108} height={22} fill={c} />)}
      {lines(["XXX", "XXX", "XXX"], 272, 221, 26, 20, c, 4)}
    </>
  )],
  [16.67, (_, c) => diamond(52, c)],
  [17.0, (_, c) => <>{diamond(38, c, -14)}{diamond(38, c, 14)}{cross(60, c)}</>],
  [17.33, B],
  [19.0, (_, c) => hex(52, c)],
  [19.33, (_, c) => <>{hex(60, c)}{cross(76, c)}</>],
  [19.67, B],

  // "Initializing"
  [20.0, (_, c) => logo("Initializing", 102, 138, true, c)],
  [20.67, (_, c) => {
    const p = hexPoints(84);
    return (
      <>
        <Polyline points={str([lerp(p[0], p[5], 0.35), p[5], p[4], lerp(p[4], p[3], 0.65)])} fill="none" stroke={c} strokeWidth={SW} />
        <Polyline points={str([lerp(p[0], p[1], 0.35), p[1], p[2], lerp(p[2], p[3], 0.65)])} fill="none" stroke={c} strokeWidth={SW} />
      </>
    );
  }],
  [21.0, (_, c) => <>{hex(76, c, 10)}{cross(84, c)}</>],
  [21.33, (lt, c) => <>{circle(88, c)}{hex(76, c, 12 + lt * 50)}</>],
  [22.0, (_, c) => circle(88, c)],
  [22.33, B],

  [25.67, (_, c) => <>{triDown(82, 140, c, -12)}{triDown(76, 130, c, 8)}</>],
  [26.0, B],
  [27.0, (_, c) => (
    <Rect x={CX - 82} y={CY - 82} width={164} height={164} fill="none" stroke={c} strokeWidth={SW} />
  )],
  [27.33, B],
  [27.67, (_, c) => lines(["XXX"], 156, 247, 0, 20, c, 3)],
  [28.0, (_, c) => (
    <>
      {[0, 26, 52].map((i) => <Rect key={i} x={152} y={204 + i} width={112} height={22} fill={c} />)}
      {lines(["XXXXX"], 264, 247, 0, 20, c, 3)}
    </>
  )],
  [28.33, (_, c) => <>{hex(58, c)}{cross(68, c)}</>],
  [28.67, blip],
  [29.0, B],
  [29.67, blip],
  [30.0, B],
  [30.67, blip],
  [31.0, B],

  [32.0, (_, c) => (
    <>
      {line(CX - 58, CY - 64, CX + 58, CY - 64, c, "t")}
      {line(CX - 66, CY - 46, CX - 22, CY + 50, c, "l")}
      {line(CX + 66, CY - 46, CX + 22, CY + 50, c, "r")}
    </>
  )],
  [32.33, (_, c) => (
    <>
      {line(CX - 58, CY + 64, CX + 58, CY + 64, c, "b")}
      {line(CX - 66, CY + 46, CX - 22, CY - 50, c, "l")}
      {line(CX + 66, CY + 46, CX + 22, CY - 50, c, "r")}
    </>
  )],
  [32.67, B],
  [33.0, (_, c) => <>{triDown(84, 150, c, -4)}{triUp(34, 60, c, -4)}{circle(66, c)}</>],
  [33.33, B],
  [33.67, (_, c) => cross(76, c)],
  [34.0, (_, c) => <>{circle(88, c)}{hex(76, c, 15)}</>],
  [34.33, (_, c) => <>{circle(88, c)}{hex(76, c, 0)}</>],
  [34.67, (_, c) => circle(88, c)],
  [35.0, blip],
  [35.33, B],
  [36.0, blip],
  [36.33, B],
  [37.0, blip],
  [37.33, B],

  // finale: circle, then the hexagon cube builds up inside it and holds
  [38.0, (_, c) => circle(88, c)],
  [38.33, (_, c) => <>{circle(88, c)}{cube(c, false)}</>],
  [38.67, (_, c) => <>{circle(88, c)}{cube(c, true)}</>],
];

const sceneAt = (t: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && SCENES[i + 1][0] <= t) i++;
  return { draw: SCENES[i][1], lt: t - SCENES[i][0] };
};

// ---------------------------------------------------------------- component
type Props = {
  onDone?: () => void;
  speed?: number;
  color?: string;
  background?: string;
};

export default function BootAnimation({
  onDone,
  speed = 1,
  color = "#ffffff",
  background = Colors.background,
}: Props) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const start = Date.now();
    let last = -1;
    let raf = 0;
    let finished = false;

    const tick = () => {
      const elapsed = ((Date.now() - start) / 1000) * speed;
      const step = Math.floor(elapsed * 30); // redraw at ~30 fps
      if (step !== last) {
        last = step;
        setT(elapsed);
      }
      if (elapsed >= END && !finished) {
        finished = true;
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  const { draw, lt } = sceneAt(t);

  return (
    <Pressable style={{ flex: 1, backgroundColor: background }} onPress={onDone}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {draw(lt, color)}
      </Svg>
    </Pressable>
  );
}
