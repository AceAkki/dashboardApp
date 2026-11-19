'use no memo';
// The React Compiler must not touch this file: widgets are drawn by Android from plain
// function calls, so no hooks and no memoization are allowed here.
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import { C } from "./widgetTheme";
import type { WidgetProps, WidgetRow } from "./tasksWidgetData";

const REGULAR = "JetBrainsMono-Regular";
const BOLD = "JetBrainsMono-Bold";
const LINE = "#0E2028"; // a row divider, a shade lighter than the panel

// the widget is about 4 cells wide: keep titles on one line
const clip = (s: string, n = 24) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function Row({ row, color }: { row: WidgetRow; color: `#${string}` }) {
  const c = row.p0 ? C.danger : color;
  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: LINE,
      }}
    >
      {/* the whole 44dp square is the tap target; the visible box is 22dp */}
      <FlexWidget
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        clickAction="DONE"
        clickActionData={{ id: row.id }}
        accessibilityLabel={`Mark ${row.name} complete`}
      >
        <FlexWidget
          style={{
            width: 22,
            height: 22,
            borderWidth: 1,
            borderColor: c as `#${string}`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {row.p0 ? (
            <TextWidget text="▲" style={{ fontSize: 9, color: c as `#${string}`, fontFamily: REGULAR }} />
          ) : null}
        </FlexWidget>
      </FlexWidget>

      <FlexWidget style={{ flex: 1, flexDirection: "column", marginLeft: 4 }}>
        <TextWidget
          text={clip(row.name)}
          style={{ fontSize: 13, color: C.textPrimary, fontFamily: REGULAR }}
        />
        <FlexWidget style={{ flexDirection: "row", marginTop: 3 }}>
          {row.tag ? (
            <TextWidget
              text={`#${row.tag}`}
              style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR }}
            />
          ) : null}
          {row.due ? (
            <TextWidget
              text={row.due}
              style={{
                fontSize: 9,
                fontFamily: REGULAR,
                marginLeft: row.tag ? 8 : 0,
                color: row.overdue ? C.danger : C.textSecondary,
              }}
            />
          ) : null}
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}

function DoneRow({ name, color }: { name: string; color: `#${string}` }) {
  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: LINE,
      }}
    >
      <FlexWidget style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
        <FlexWidget
          style={{
            width: 22,
            height: 22,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextWidget text="✓" style={{ fontSize: 13, color: C.textOnPrimary, fontFamily: BOLD }} />
        </FlexWidget>
      </FlexWidget>
      <FlexWidget style={{ flex: 1, flexDirection: "column", marginLeft: 4 }}>
        <TextWidget
          text={clip(name)}
          style={{ fontSize: 13, color: C.textMuted, fontFamily: REGULAR }}
        />
        <FlexWidget style={{ flexDirection: "row", marginTop: 3 }}>
          <TextWidget text="DONE" style={{ fontSize: 9, color: C.success, fontFamily: REGULAR }} />
          <FlexWidget
            style={{ marginLeft: 10, paddingHorizontal: 6 }}
            clickAction="UNDO"
            accessibilityLabel={`Undo completing ${name}`}
          >
            <TextWidget text="UNDO" style={{ fontSize: 9, color: C.primary, fontFamily: BOLD }} />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}

function Tab({
  tab,
  label,
  count,
  active,
  color,
}: {
  tab: string;
  label: string;
  count: number;
  active: boolean;
  color: `#${string}`;
}) {
  const c = active ? color : C.textSecondary;
  return (
    <FlexWidget
      style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
      clickAction="TAB"
      clickActionData={{ tab }}
      accessibilityLabel={`${label} tab, ${count} tasks`}
    >
      <TextWidget
        text={String(count).padStart(2, "0")}
        style={{ fontSize: 16, color: c as `#${string}`, fontFamily: BOLD }}
      />
      <TextWidget
        text={label}
        style={{ fontSize: 9, color: c as `#${string}`, fontFamily: REGULAR, letterSpacing: 1 }}
      />
      <FlexWidget
        style={{
          width: "match_parent",
          height: 2,
          marginTop: 6,
          backgroundColor: (active ? color : C.border) as `#${string}`,
        }}
      />
    </FlexWidget>
  );
}

export function TasksListWidget({ tab, rows, counts, total, lastDone }: WidgetProps) {
  const accent = (tab === "current" ? C.primary : C.danger) as `#${string}`;
  const empty = rows.length === 0 && !lastDone;

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        backgroundColor: C.surface as `#${string}`,
        borderWidth: 1,
        borderColor: C.border as `#${string}`,
      }}
      accessibilityLabel="Tasks widget"
    >
      {/* accent bar on the left edge, like the cards in the app */}
      <FlexWidget style={{ width: 3, height: "match_parent", backgroundColor: accent }} />

      <FlexWidget style={{ flex: 1, flexDirection: "column", padding: 12 }}>
        <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center" }}>
          <TextWidget
            text="// TASKS"
            style={{ fontSize: 11, color: accent, fontFamily: REGULAR, letterSpacing: 1 }}
          />
          <FlexWidget style={{ flex: 1 }} />
          <TextWidget
            text={`SHOWING ${rows.length + (lastDone ? 1 : 0)} OF ${total + (lastDone ? 1 : 0)}`}
            style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR }}
          />
        </FlexWidget>

        <FlexWidget style={{ width: "match_parent", flexDirection: "row", marginTop: 8 }}>
          <Tab tab="current" label="CURRENT" count={counts.current} active={tab === "current"} color={C.primary as `#${string}`} />
          <Tab tab="priority" label="PRIORITY" count={counts.priority} active={tab === "priority"} color={C.danger as `#${string}`} />
        </FlexWidget>

        <FlexWidget style={{ width: "match_parent", flex: 1, flexDirection: "column", marginTop: 6 }}>
          {lastDone ? <DoneRow name={lastDone.name} color={accent} /> : null}
          {rows.map((r) => (
            <Row key={r.id} row={r} color={accent} />
          ))}
          {empty ? (
            <FlexWidget style={{ flex: 1, width: "match_parent", alignItems: "center", justifyContent: "center" }}>
              <TextWidget
                text="// QUEUE CLEAR"
                style={{ fontSize: 11, color: C.textMuted, fontFamily: REGULAR, letterSpacing: 1 }}
              />
            </FlexWidget>
          ) : null}
        </FlexWidget>

        <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <FlexWidget
            style={{ paddingVertical: 6, paddingRight: 12 }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: "terminaldeck://TaskManager?add=1" }}
            accessibilityLabel="Add a task"
          >
            <TextWidget text="+ ADD" style={{ fontSize: 11, color: accent, fontFamily: BOLD }} />
          </FlexWidget>
          <FlexWidget style={{ flex: 1 }} />
          <FlexWidget
            style={{ paddingVertical: 6, paddingLeft: 12 }}
            clickAction="OPEN_APP"
            accessibilityLabel="Open the app"
          >
            <TextWidget text="OPEN APP >" style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR }} />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
