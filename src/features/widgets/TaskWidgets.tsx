'use no memo';
// Hooks and memoization are not allowed in widget files (see TasksListWidget).
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import { Panel, Segments, Title } from "./widgetKit";
import { BOLD, C, REGULAR, hex } from "./widgetTheme";

const OPEN_TASKS = { uri: "terminaldeck://TaskManager" };
const ADD_TASK = { uri: "terminaldeck://TaskManager?add=1" };

// 2 x 2: how many tasks of ONE kind. Which kind is decided by which widget the user adds
// ("Active tasks" or "P0 tasks" in the widget picker). Tap = open the task list.
export function TaskCount({
  kind,
  count,
  overdue,
}: {
  kind: "active" | "P0";
  count: number;
  overdue: number;
}) {
  const color = kind === "P0" ? C.danger : C.primary;
  // ten squares: how much of the list is overdue
  const lit = count === 0 ? 0 : Math.max(overdue > 0 ? 1 : 0, Math.round((overdue / count) * 10));
  return (
    <Panel
      color={color}
      label={`${count} ${kind === "P0" ? "priority" : "active"} tasks`}
      clickAction="OPEN_URI"
      clickActionData={OPEN_TASKS}
    >
      <FlexWidget style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "column", padding: 10 }}>
        <Title text={kind === "P0" ? "P0" : "ACTIVE"} color={color} />
        <FlexWidget style={{ flex: 1, height: 0, width: "match_parent", justifyContent: "center" }}>
          <TextWidget
            text={String(count).padStart(2, "0")}
            style={{ fontSize: 46, color: hex(color), fontFamily: BOLD }}
          />
          <TextWidget
            text={kind === "P0" ? "PRIORITY TASKS" : "OPEN TASKS"}
            style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR, letterSpacing: 1 }}
          />
        </FlexWidget>
        <Segments filled={lit} total={10} color={C.danger} size={7} />
        <TextWidget
          text={overdue > 0 ? `${overdue} OVERDUE` : "ALL ON TRACK"}
          style={{
            fontSize: 9,
            marginTop: 5,
            fontFamily: overdue > 0 ? BOLD : REGULAR,
            color: overdue > 0 ? C.danger : C.textSecondary,
          }}
        />
      </FlexWidget>
    </Panel>
  );
}

// 4 x 1: a bar that looks like the terminal prompt. A widget cannot hold a text field, so a tap opens the app's new-task sheet.
export function AddTask() {
  return (
    <Panel color={C.primary} label="Add a task" clickAction="OPEN_URI" clickActionData={ADD_TASK}>
      <FlexWidget style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "row", alignItems: "center" }}>
        <TextWidget text=">" style={{ fontSize: 15, color: C.primary, fontFamily: BOLD, marginLeft: 12 }} />
        <TextWidget
          text="add a task▌"
          style={{ fontSize: 13, color: C.textMuted, fontFamily: REGULAR, marginLeft: 8 }}
        />
        <FlexWidget style={{ flex: 1, width: 0 }} />
        <FlexWidget
          style={{
            width: 52,
            height: "match_parent",
            backgroundColor: C.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextWidget text="+" style={{ fontSize: 24, color: C.textOnPrimary, fontFamily: BOLD }} />
        </FlexWidget>
      </FlexWidget>
    </Panel>
  );
}
