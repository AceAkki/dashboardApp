'use no memo';
// Hooks and memoization are not allowed in widget files (see TasksListWidget).
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import { BOLD, C, REGULAR, hex } from "./widgetTheme";

const OPEN_TASKS = { uri: "terminaldeck://TaskManager" };
const ADD_TASK = { uri: "terminaldeck://TaskManager?add=1" };

// 2 x 2: how many tasks of ONE kind. Which kind is decided by which widget the user adds
// ("Tasks · Active" or "Tasks · P0" in the widget picker). Tap = open the task list.
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
      clickAction="OPEN_URI"
      clickActionData={OPEN_TASKS}
      accessibilityLabel={`${count} ${kind === "P0" ? "priority" : "active"} tasks`}
    >
      <FlexWidget style={{ width: 3, height: "match_parent", backgroundColor: color }} />
      <FlexWidget style={{ flex: 1, flexDirection: "column", padding: 12 }}>
        <TextWidget
          text={kind === "P0" ? "// P0" : "// ACTIVE"}
          style={{ fontSize: 11, color, fontFamily: REGULAR, letterSpacing: 1 }}
        />
        <FlexWidget style={{ flex: 1, width: "match_parent", justifyContent: "center" }}>
          <TextWidget
            text={String(count).padStart(2, "0")}
            style={{ fontSize: 44, color, fontFamily: BOLD }}
          />
          <TextWidget
            text={kind === "P0" ? "PRIORITY TASKS" : "OPEN TASKS"}
            style={{ fontSize: 9, color: C.textSecondary, fontFamily: REGULAR, letterSpacing: 1 }}
          />
        </FlexWidget>
        <TextWidget
          text={overdue > 0 ? `${overdue} OVERDUE` : "ALL ON TRACK"}
          style={{ fontSize: 9, color: overdue > 0 ? C.danger : C.textSecondary, fontFamily: REGULAR }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

// 4 x 1: a bar that looks like the terminal prompt. A widget cannot hold a text field, so a tap opens the app's new-task sheet.
export function AddTask() {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
      }}
      clickAction="OPEN_URI"
      clickActionData={ADD_TASK}
      accessibilityLabel="Add a task"
    >
      <FlexWidget style={{ width: 3, height: "match_parent", backgroundColor: C.primary }} />
      <TextWidget text=">" style={{ fontSize: 15, color: C.primary, fontFamily: BOLD, marginLeft: 12 }} />
      <TextWidget text="add a task…" style={{ fontSize: 13, color: C.textMuted, fontFamily: REGULAR, marginLeft: 10 }} />
      <FlexWidget style={{ flex: 1 }} />
      <FlexWidget
        style={{
          width: 52,
          height: "match_parent",
          backgroundColor: hex(C.primary),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextWidget text="+" style={{ fontSize: 24, color: C.textOnPrimary, fontFamily: BOLD }} />
      </FlexWidget>
    </FlexWidget>
  );
}
