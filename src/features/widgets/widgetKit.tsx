'use no memo';
// Shared pieces of every home screen widget, so all of them look like one family (square corners, left accent bar,
// "// TITLE" headers, square checkboxes and buttons). No hooks or memoization here: Android draws widgets from plain
// function calls (see TasksListWidget).
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import { BOLD, C, REGULAR, hex } from "./widgetTheme";

type Hex = `#${string}`;

// the outer box of a widget: dark panel, thin border, accent bar down the left edge
export function Panel({
  color,
  label,
  children,
  clickAction,
  clickActionData,
}: {
  color: string;
  label: string;
  children: any;
  clickAction?: string;
  clickActionData?: Record<string, unknown>;
}) {
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
      clickAction={clickAction}
      clickActionData={clickActionData}
      accessibilityLabel={label}
    >
      <FlexWidget style={{ width: 3, height: "match_parent", backgroundColor: hex(color) }} />
      {children}
    </FlexWidget>
  );
}

// "■ // TITLE": a small filled square and the title in the app's header style
export function Title({ text, color }: { text: string; color: string }) {
  return (
    <FlexWidget style={{ flexDirection: "row", alignItems: "center" }}>
      <FlexWidget style={{ width: 6, height: 6, backgroundColor: hex(color), marginRight: 6 }} />
      <TextWidget
        text={`// ${text}`}
        style={{ fontSize: 11, color: hex(color), fontFamily: BOLD, letterSpacing: 1 }}
      />
    </FlexWidget>
  );
}

// square button: filled (main action) or outlined (secondary), like the app's buttons
export function Btn({
  label,
  color,
  filled = false,
  width,
  height = 30,
  clickAction,
  clickActionData,
  a11y,
}: {
  label: string;
  color: string;
  filled?: boolean;
  /** omit to share the row equally (flex 1) */
  width?: number;
  height?: number;
  clickAction: string;
  clickActionData?: Record<string, unknown>;
  a11y: string;
}) {
  return (
    <FlexWidget
      style={{
        ...(width ? { width } : { flex: 1, width: 0 }),
        height,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: filled ? hex(color) : C.surface,
        borderWidth: 1,
        borderColor: hex(color),
      }}
      clickAction={clickAction}
      clickActionData={clickActionData}
      accessibilityLabel={a11y}
    >
      <TextWidget
        text={label}
        style={{
          fontSize: 10,
          color: filled ? C.textOnPrimary : hex(color),
          fontFamily: BOLD,
          letterSpacing: 1,
        }}
      />
    </FlexWidget>
  );
}

// the square checkbox of a task. Checked = filled square with a tick.
export function Check({ color, checked = false, size = 22 }: { color: string; checked?: boolean; size?: number }) {
  return (
    <FlexWidget
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: hex(color),
        backgroundColor: checked ? hex(color) : undefined,
      }}
    >
      {checked ? (
        <TextWidget text="✓" style={{ fontSize: size * 0.6, color: C.textOnPrimary, fontFamily: BOLD }} />
      ) : null}
    </FlexWidget>
  );
}

// row of small squares, `filled` of `total` lit
export function Segments({
  filled,
  total,
  color,
  size = 8,
}: {
  filled: number;
  total: number;
  color: string;
  size?: number;
}) {
  return (
    <FlexWidget style={{ flexDirection: "row" }}>
      {Array.from({ length: total }, (_, i) => (
        <FlexWidget
          key={i}
          style={{
            width: size,
            height: size,
            marginLeft: i ? 4 : 0,
            borderWidth: 1,
            borderColor: i < filled ? hex(color) : C.border,
            backgroundColor: i < filled ? hex(color) : undefined,
          }}
        />
      ))}
    </FlexWidget>
  );
}

// thin progress bar made of two weighted boxes
export function Bar({ fraction, color }: { fraction: number; color: string }) {
  const filled = Math.max(1, Math.round(Math.min(1, Math.max(0, fraction)) * 100));
  const rest = 100 - filled;
  return (
    <FlexWidget style={{ width: "match_parent", height: 4, flexDirection: "row", backgroundColor: C.border as Hex }}>
      <FlexWidget style={{ flex: filled, width: 0, height: 4, backgroundColor: hex(color) }} />
      {rest > 0 ? <FlexWidget style={{ flex: rest, width: 0, height: 4 }} /> : null}
    </FlexWidget>
  );
}

// shown instead of Android's "Can't load widget" if drawing fails; a tap opens the app
export function Fallback() {
  return (
    <Panel color={C.primary} label="terminalDeck widget" clickAction="OPEN_APP">
      <FlexWidget style={{ flex: 1, width: 0, height: "match_parent", flexDirection: "column", justifyContent: "center", padding: 12 }}>
        <Title text="TERMINALDECK" color={C.primary} />
        <TextWidget
          text="tap to open the app"
          style={{ fontSize: 10, color: C.textSecondary, fontFamily: REGULAR, marginTop: 6 }}
        />
      </FlexWidget>
    </Panel>
  );
}
