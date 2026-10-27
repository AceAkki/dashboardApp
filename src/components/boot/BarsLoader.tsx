import { Fragment } from "react";
import { Line, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { Typography } from "@/constants/Typography";
import { BootCanvas, STROKE, range, useBootClock, type BootProps } from "./bootKit";

// Stacked loading bars, then the "System Loading" block.
// Plays video frames 28-38 (bars sliding in, crossing a diamond) and 89-115
// (small square + two bars + label, bars creeping, third bar snapping in).
// ~1.3 s at speed 1.
//
//   <BarsLoader size={240} onDone={() => ...} />
//   <BarsLoader label="Loading" />           // change the label text

const FRAMES = [...range(28, 38), ...range(89, 115)];

const ROW_Y = [208, 235, 261];
const X_LEFT = [204, 225, 246, 266, 288, 308]; // placeholder "X" glyph columns
const TEXT_TOP = [208, 234, 262];

// part A: bar width and whether the X placeholders show, frames 28-32
const A_BARS: Record<number, [number, boolean]> = {
  28: [39, true],
  29: [73, false],
  30: [106, true],
  31: [106, true],
  32: [139, false],
};

// part A: left edge of each bar, frames 33-38 (staggered at 34 and 35)
const A_SHIFT: Record<number, number[]> = {
  33: [161, 161, 161],
  34: [166, 219, 190],
  35: [173, 276, 219],
};

type Props = BootProps & { label?: string };

export default function BarsLoader({ label = "System Loading", color = "#fff", size, style, holdLast = false, ...clock }: Props) {
  const i = useBootClock(FRAMES.length, { ...clock, holdLast });
  const k = i < 0 ? -1 : FRAMES[i];

  return (
    <BootCanvas size={size} style={style}>
      {k >= 28 && k <= 32 && (
        <>
          {ROW_Y.map((y, r) => (
            <Rect key={r} x={161} y={y} width={A_BARS[k][0]} height={22} fill={color} />
          ))}
          {A_BARS[k][1] &&
            ROW_Y.map((_, r) =>
              X_LEFT.filter((x) => x >= 161 + A_BARS[k][0] + 3).map((x) => (
                <SvgText
                  key={`${r}-${x}`}
                  x={x}
                  y={TEXT_TOP[r] + 20}
                  fontSize={26}
                  fontFamily={Typography.secondary}
                  fill={color}
                >
                  X
                </SvgText>
              )),
            )}
        </>
      )}

      {k >= 33 && k <= 38 && (
        <>
          {ROW_Y.map((y, r) => (
            <Rect
              key={r}
              x={(A_SHIFT[k] ?? [161, 161, 161])[r]}
              y={y}
              width={175}
              height={22}
              fill={color}
            />
          ))}
          <Diamond cx={247} cy={237.5 + (k - 33) * 0.3} h={54.5 + (k - 33)} color={color} />
          {k === 38 && (
            <>
              <Line x1={198} y1={310} x2={282} y2={196} stroke={color} strokeWidth={STROKE} />
              <Line x1={282} y1={310} x2={198} y2={196} stroke={color} strokeWidth={STROKE} />
            </>
          )}
        </>
      )}

      {k >= 89 && (
        <Fragment>
          <Rect x={162} y={181} width={25} height={23} fill={color} />

          {(k === 89 || k >= 94) && (
            <Rect
              x={161}
              y={208}
              width={(k === 89 ? 239 : Math.min(245 + (k - 94) * 1.58, 274)) - 160}
              height={22}
              fill={color}
            />
          )}
          {k >= 113 && <Rect x={161} y={235} width={173} height={22} fill={color} />}
          {(k === 89 || k >= 94) && (
            <Rect
              x={161}
              y={261}
              width={(k === 89 ? 277 : Math.min(282 + (k - 94) * 1.47, 308)) - 160}
              height={22}
              fill={color}
            />
          )}

          {k <= 111 && (
            <SvgText
              x={163}
              y={251}
              fontSize={22}
              fontFamily={Typography.secondary_medium}
              fill={color}
            >
              {label}
            </SvgText>
          )}
        </Fragment>
      )}
    </BootCanvas>
  );
}

function Diamond({ cx, cy, h, color }: { cx: number; cy: number; h: number; color: string }) {
  return (
    <Polygon
      points={`${cx},${cy - h} ${cx + h},${cy} ${cx},${cy + h} ${cx - h},${cy}`}
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
    />
  );
}
