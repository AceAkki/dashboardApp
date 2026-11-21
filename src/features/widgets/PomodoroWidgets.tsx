'use no memo';
// Hooks and memoization are not allowed in widget files (see TasksListWidget).
import React from "react";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

import type { PomoProps } from "./pomodoroWidgetData";
import { Bar, Btn, Panel, Segments } from "./widgetKit";
import { BOLD, C, REGULAR, hex } from "./widgetTheme";

const toggleLabel = (s: PomoProps["state"]) =>
  s === "running" ? "PAUSE" : s === "paused" ? "RESUME" : s === "done" ? "NEXT" : "START";

// the ring as a small SVG picture: a grey track and a coloured arc that starts at 12 o'clock
function ringSvg(size: number, stroke: number, fraction: number, color: string) {
  const r = (size - stroke) / 2;
  const c = size / 2;
  const f = Math.min(1, Math.max(0, fraction));
  const track = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${C.border}" stroke-width="${stroke}"/>`;
  let arc = "";
  if (f >= 0.999) {
    arc = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"/>`;
  } else if (f > 0) {
    const a = 2 * Math.PI * f;
    const x = (c + r * Math.sin(a)).toFixed(2);
    const y = (c - r * Math.cos(a)).toFixed(2);
    arc = `<path d="M ${c} ${c - r} A ${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${x} ${y}" fill="none" stroke="${color}" stroke-width="${stroke}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${track}${arc}</svg>`;
}

function Toggle({ p, w, h = 34 }: { p: PomoProps; w?: number; h?: number }) {
  return (
    <Btn
      label={toggleLabel(p.state)}
      color={p.color}
      filled
      width={w}
      height={h}
      clickAction="POMO_TOGGLE"
      a11y={`${toggleLabel(p.state)} timer`}
    />
  );
}

function Skip({ w = 52, h = 34 }: { w?: number; h?: number }) {
  return (
    <FlexWidget style={{ marginLeft: 6 }}>
      <Btn label="SKIP" color={C.textSecondary} width={w} height={h} clickAction="POMO_SKIP" a11y="Skip to the next phase" />
    </FlexWidget>
  );
}

function Dots({ n, total, color }: { n: number; total: number; color: string }) {
  return <Segments filled={n} total={total} color={color} />;
}

// the three modes as square segments: the current one is filled
function ModeChips({ p }: { p: PomoProps }) {
  return (
    <FlexWidget style={{ flexDirection: "row", width: "match_parent" }}>
      {(["focus", "short", "long"] as const).map((m, i) => {
        const on = m === p.mode;
        return (
          <FlexWidget
            key={m}
            style={{
              flex: 1, width: 0,
              height: 22,
              marginLeft: i ? 4 : 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: on ? hex(p.color) : C.surface,
              borderWidth: 1,
              borderColor: on ? hex(p.color) : C.border,
            }}
            clickAction="POMO_MODE"
            clickActionData={{ mode: m }}
            accessibilityLabel={`Switch to ${m}`}
          >
            <TextWidget
              text={m === "focus" ? "FOCUS" : m === "short" ? "SHORT" : "LONG"}
              style={{ fontSize: 9, color: on ? C.textOnPrimary : C.textSecondary, fontFamily: on ? BOLD : REGULAR }}
            />
          </FlexWidget>
        );
      })}
    </FlexWidget>
  );
}

// ───────────────────────── 4 x 1 ─────────────────────────
export function Pomodoro4x1(p: PomoProps) {
  return (
    <Panel color={p.color} label="Pomodoro widget">
      <FlexWidget
        style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}
      >
        <FlexWidget style={{ flexDirection: "column", width: 84 }}>
          <TextWidget text={p.modeLabel} style={{ fontSize: 9, color: hex(p.color), fontFamily: REGULAR, letterSpacing: 1 }} />
          <TextWidget
            text={p.headline}
            style={{ fontSize: p.state === "running" ? 14 : 18, color: C.textPrimary, fontFamily: BOLD }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, width: 0, flexDirection: "column", marginHorizontal: 8 }}>
          <TextWidget
            maxLines={1}
            text={`${Math.min(p.sessions + 1, p.sessionsTotal)}/${p.sessionsTotal} SESSIONS`}
            style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR, marginBottom: 5 }}
          />
          <Bar fraction={p.fraction} color={p.color} />
        </FlexWidget>
        <Toggle p={p} w={64} h={38} />
        <Skip w={44} h={38} />
      </FlexWidget>
    </Panel>
  );
}

// ───────────────────────── 4 x 2 ─────────────────────────
export function Pomodoro4x2(p: PomoProps) {
  return (
    <Panel color={p.color} label="Pomodoro widget">
      <FlexWidget style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "row", alignItems: "center", padding: 12 }}>
        <SvgWidget svg={ringSvg(84, 8, p.fraction, p.color)} style={{ width: 84, height: 84 }} />
        <FlexWidget style={{ flex: 1, width: 0, flexDirection: "column", marginLeft: 14 }}>
          <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center" }}>
            <TextWidget text={`// ${p.modeLabel}`} style={{ fontSize: 10, color: hex(p.color), fontFamily: REGULAR, letterSpacing: 1 }} />
            <FlexWidget style={{ flex: 1, width: 0 }} />
            <Dots n={p.sessions} total={p.sessionsTotal} color={p.color} />
          </FlexWidget>
          <TextWidget
            text={p.headline}
            style={{ fontSize: p.state === "running" ? 20 : 26, color: C.textPrimary, fontFamily: BOLD, marginTop: 4 }}
          />
          <FlexWidget style={{ width: "match_parent", marginTop: 6 }}>
            <ModeChips p={p} />
          </FlexWidget>
          <FlexWidget style={{ width: "match_parent", flexDirection: "row", marginTop: 8 }}>
            <Toggle p={p} />
            <Skip />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    </Panel>
  );
}

// ───────────────────────── 2 x 2 ─────────────────────────
export function Pomodoro2x2(p: PomoProps) {
  return (
    <Panel color={p.color} label="Pomodoro widget">
      <FlexWidget style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "column", padding: 10 }}>
        <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center" }}>
          <TextWidget text={`// ${p.mode === "focus" ? "FOCUS" : "BREAK"}`} style={{ fontSize: 10, color: hex(p.color), fontFamily: REGULAR, letterSpacing: 1 }} />
          <FlexWidget style={{ flex: 1, width: 0 }} />
          <Dots n={p.sessions} total={p.sessionsTotal} color={p.color} />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, height: 0, width: "match_parent", alignItems: "center", justifyContent: "center" }}>
          <TextWidget
            text={p.headline}
            style={{ fontSize: p.state === "running" ? 17 : 26, color: C.textPrimary, fontFamily: BOLD }}
          />
          <TextWidget
            text={p.state === "running" ? "RUNNING" : `${p.minutes} MIN`}
            style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR, marginTop: 2 }}
          />
        </FlexWidget>
        <Bar fraction={p.fraction} color={p.color} />
        <FlexWidget style={{ width: "match_parent", flexDirection: "row", marginTop: 8 }}>
          <Toggle p={p} h={32} />
          <Skip w={46} h={32} />
        </FlexWidget>
      </FlexWidget>
    </Panel>
  );
}
