'use no memo';
// The React Compiler must not touch this file: widgets are drawn by Android from plain
// function calls, so no hooks and no memoization are allowed here.
import React from "react";
import { FlexWidget, ListWidget, TextWidget } from "react-native-android-widget";

import { Btn, Check, Panel, Title } from "./widgetKit";
import { BOLD, C, LINE, REGULAR, hex } from "./widgetTheme";
import type { WidgetProps, WidgetRow } from "./tasksWidgetData";

const ROW_H = 54;
const OPEN_TASKS = { uri: "terminaldeck://TaskManager" };
const ADD_TASK = { uri: "terminaldeck://TaskManager?add=1" };

function Row({ row, color }: { row: WidgetRow; color: string }) {
  const c = row.p0 ? C.danger : color;
  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: ROW_H,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: LINE,
      }}
    >
      {/* the whole 44dp square is the tap target for "done"; the visible box is 22dp */}
      <FlexWidget
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        clickAction="DONE"
        clickActionData={{ id: row.id }}
        accessibilityLabel={`Mark ${row.name} complete`}
      >
        <Check color={c} />
      </FlexWidget>

      {/* the rest of the row opens the task list */}
      <FlexWidget
        style={{ flex: 1, width: 0, flexDirection: "column", marginLeft: 4, paddingRight: 6 }}
        clickAction="OPEN_URI"
        clickActionData={OPEN_TASKS}
        accessibilityLabel={row.name}
      >
        <TextWidget
          text={row.name}
          maxLines={1}
          truncate="END"
          style={{ fontSize: 13, color: C.textPrimary, fontFamily: REGULAR }}
        />
        {row.tag || row.due ? (
          <FlexWidget style={{ flexDirection: "row", marginTop: 3 }}>
            {row.tag ? (
              <TextWidget
                text={`#${row.tag}`}
                maxLines={1}
                style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR }}
              />
            ) : null}
            {row.due ? (
              <TextWidget
                text={row.due}
                maxLines={1}
                style={{
                  fontSize: 9,
                  fontFamily: row.overdue ? BOLD : REGULAR,
                  marginLeft: row.tag ? 8 : 0,
                  color: row.overdue ? C.danger : C.textSecondary,
                }}
              />
            ) : null}
          </FlexWidget>
        ) : null}
      </FlexWidget>
    </FlexWidget>
  );
}

// shown on top for a while after a task is completed from the widget
function DoneRow({ name, color }: { name: string; color: string }) {
  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: ROW_H,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: LINE,
      }}
    >
      <FlexWidget style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
        <Check color={color} checked />
      </FlexWidget>
      <FlexWidget style={{ flex: 1, width: 0, flexDirection: "column", marginLeft: 4, paddingRight: 6 }}>
        <TextWidget
          text={name}
          maxLines={1}
          truncate="END"
          style={{ fontSize: 13, color: C.textMuted, fontFamily: REGULAR }}
        />
        <TextWidget text="DONE" style={{ fontSize: 9, color: C.success, fontFamily: BOLD, marginTop: 3 }} />
      </FlexWidget>
      <FlexWidget style={{ marginRight: 4 }}>
        <Btn label="UNDO" color={C.primary} width={52} height={28} clickAction="UNDO" a11y={`Undo completing ${name}`} />
      </FlexWidget>
    </FlexWidget>
  );
}

// the two tabs are square segments: the open one is filled
function Tab({
  tab,
  label,
  count,
  active,
  color,
  gap,
}: {
  tab: string;
  label: string;
  count: number;
  active: boolean;
  color: string;
  gap?: boolean;
}) {
  const ink = active ? C.textOnPrimary : hex(color);
  return (
    <FlexWidget
      style={{
        flex: 1, width: 0,
        height: 30,
        marginRight: gap ? 6 : 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? hex(color) : C.surface,
        borderWidth: 1,
        borderColor: active ? hex(color) : C.border,
      }}
      clickAction="TAB"
      clickActionData={{ tab }}
      accessibilityLabel={`${label} tab, ${count} tasks`}
    >
      <TextWidget text={label} style={{ fontSize: 10, color: ink, fontFamily: BOLD, letterSpacing: 1 }} />
      <TextWidget
        text={String(count).padStart(2, "0")}
        style={{ fontSize: 10, color: ink, fontFamily: REGULAR, marginLeft: 6 }}
      />
    </FlexWidget>
  );
}

export function TasksListWidget({ tab, rows, counts, lastDone }: WidgetProps) {
  const accent = tab === "current" ? C.primary : C.danger;
  const empty = rows.length === 0 && !lastDone;

  return (
    <Panel color={accent} label="Tasks widget">
      <FlexWidget style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "column", padding: 10 }}>
        <FlexWidget style={{ width: "match_parent", flexDirection: "row", alignItems: "center" }}>
          <Title text="TASKS" color={accent} />
          <FlexWidget style={{ flex: 1, width: 0 }} />
          <Btn
            label="+ NEW"
            color={accent}
            filled
            width={64}
            height={26}
            clickAction="OPEN_URI"
            clickActionData={ADD_TASK}
            a11y="Add a task"
          />
        </FlexWidget>

        <FlexWidget style={{ width: "match_parent", flexDirection: "row", marginTop: 8 }}>
          <Tab tab="current" label="CURRENT" count={counts.current} active={tab === "current"} color={C.primary} gap />
          <Tab tab="priority" label="PRIORITY" count={counts.priority} active={tab === "priority"} color={C.danger} />
        </FlexWidget>

        <FlexWidget style={{ flex: 1, height: 0, width: "match_parent", marginTop: 4 }}>
          {empty ? (
            <FlexWidget
              style={{ width: "match_parent", height: "match_parent", alignItems: "center", justifyContent: "center" }}
            >
              <TextWidget
                text="// QUEUE CLEAR"
                style={{ fontSize: 11, color: C.textMuted, fontFamily: REGULAR, letterSpacing: 1 }}
              />
            </FlexWidget>
          ) : (
            // every task of the open tab, scrollable
            <ListWidget style={{ width: "match_parent", height: "match_parent" }}>
              {lastDone ? <DoneRow name={lastDone.name} color={accent} /> : null}
              {rows.map((r) => (
                <Row key={r.id} row={r} color={accent} />
              ))}
            </ListWidget>
          )}
        </FlexWidget>
      </FlexWidget>
    </Panel>
  );
}
