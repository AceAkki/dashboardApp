'use no memo';
// Hooks and memoization are not allowed in widget files (see TasksListWidget).
import React from "react";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

import type { PomoProps } from "./pomodoroWidgetData";
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

function Toggle({ p, w, h = 36 }: { p: PomoProps; w?: number; h?: number }) {
  return (
    <FlexWidget
      style={{
        ...(w ? { width: w } : { flex: 1 }),
        height: h,
        backgroundColor: hex(p.color),
        alignItems: "center",
        justifyContent: "center",
      }}
      clickAction="POMO_TOGGLE"
      accessibilityLabel={`${toggleLabel(p.state)} timer`}
    >
      <TextWidget
        text={toggleLabel(p.state)}
        style={{ fontSize: 11, color: C.textOnPrimary, fontFamily: BOLD, letterSpacing: 1 }}
      />
    </FlexWidget>
  );
}

function Skip({ w = 52, h = 36 }: { w?: number; h?: number }) {
  return (
    <FlexWidget
      style={{
        width: w,
        height: h,
        marginLeft: 6,
        borderWidth: 1,
        borderColor: C.textSecondary,
        alignItems: "center",
        justifyContent: "center",
      }}
      clickAction="POMO_SKIP"
      accessibilityLabel="Skip to the next phase"
    >
      <TextWidget text="SKIP" style={{ fontSize: 10, color: C.textSecondary, fontFamily: REGULAR }} />
    </FlexWidget>
  );
}

function Dots({ n, total, color }: { n: number; total: number; color: string }) {
  return (
    <FlexWidget style={{ flexDirection: "row" }}>
      {Array.from({ length: total }, (_, i) => (
        <FlexWidget
          key={i}
          style={{
            width: 8,
            height: 8,
            marginLeft: i ? 4 : 0,
            backgroundColor: i < n ? hex(color) : undefined,
            borderWidth: 1,
            borderColor: i < n ? hex(color) : C.border,
          }}
        />
      ))}
    </FlexWidget>
  );
}

function Bar({ fraction, color }: { fraction: number; color: string }) {
  const filled = Math.max(1, Math.round(fraction * 100));
  const rest = 100 - filled;
  return (
    <FlexWidget style={{ width: "match_parent", height: 4, flexDirection: "row", backgroundColor: C.border }}>
      <FlexWidget style={{ flex: filled, height: 4, backgroundColor: hex(color) }} />
      {rest > 0 ? <FlexWidget style={{ flex: rest, height: 4 }} /> : null}
    </FlexWidget>
  );
}

function ModeChips({ p }: { p: PomoProps }) {
  return (
    <FlexWidget style={{ flexDirection: "row" }}>
      {(["focus", "short", "long"] as const).map((m) => {
        const on = m === p.mode;
        return (
          <FlexWidget
            key={m}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginRight: 6,
              borderWidth: 1,
              borderColor: on ? hex(p.color) : C.border,
            }}
            clickAction="POMO_MODE"
            clickActionData={{ mode: m }}
            accessibilityLabel={`Switch to ${m}`}
          >
            <TextWidget
              text={m.toUpperCase()}
              style={{ fontSize: 9, color: on ? hex(p.color) : C.textSecondary, fontFamily: REGULAR }}
            />
          </FlexWidget>
        );
      })}
    </FlexWidget>
  );
}

// panel with the left accent bar used by every widget
function Panel({ color, label, children }: { color: string; label: string; children: any }) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
      }}
      accessibilityLabel={label}
    >
      <FlexWidget style={{ width: 3, height: "match_parent", backgroundColor: hex(color) }} />
      {children}
    </FlexWidget>
  );
}

// ───────────────────────── 4 x 1 ─────────────────────────
export function Pomodoro4x1(p: PomoProps) {
  return (
    <Panel color={p.color} label="Pomodoro widget">
      <FlexWidget
        style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}
      >
        <FlexWidget style={{ flexDirection: "column", width: 92 }}>
          <TextWidget text={p.modeLabel} style={{ fontSize: 9, color: hex(p.color), fontFamily: REGULAR, letterSpacing: 1 }} />
          <TextWidget
            text={p.headline}
            style={{ fontSize: p.state === "running" ? 14 : 18, color: C.textPrimary, fontFamily: BOLD }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, flexDirection: "column", marginHorizontal: 8 }}>
          <TextWidget
            text={`SESSION ${Math.min(p.sessions + 1, p.sessionsTotal)}/${p.sessionsTotal}`}
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
      <FlexWidget style={{ flex: 1, flexDirection: "row", alignItems: "center", padding: 12 }}>
        <SvgWidget svg={ringSvg(84, 8, p.fraction, p.color)} style={{ width: 84, height: 84 }} />
        <FlexWidget style={{ flex: 1, flexDirection: "column", marginLeft: 14 }}>
          <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center" }}>
            <TextWidget text={`// ${p.modeLabel}`} style={{ fontSize: 10, color: hex(p.color), fontFamily: REGULAR, letterSpacing: 1 }} />
            <FlexWidget style={{ flex: 1 }} />
            <Dots n={p.sessions} total={p.sessionsTotal} color={p.color} />
          </FlexWidget>
          <TextWidget
            text={p.headline}
            style={{ fontSize: p.state === "running" ? 20 : 26, color: C.textPrimary, fontFamily: BOLD, marginTop: 4 }}
          />
          <FlexWidget style={{ marginTop: 6 }}>
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
      <FlexWidget style={{ flex: 1, flexDirection: "column", padding: 10 }}>
        <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center" }}>
          <TextWidget text={`// ${p.mode === "focus" ? "FOCUS" : "BREAK"}`} style={{ fontSize: 10, color: hex(p.color), fontFamily: REGULAR, letterSpacing: 1 }} />
          <FlexWidget style={{ flex: 1 }} />
          <Dots n={p.sessions} total={p.sessionsTotal} color={p.color} />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, width: "match_parent", alignItems: "center", justifyContent: "center" }}>
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
