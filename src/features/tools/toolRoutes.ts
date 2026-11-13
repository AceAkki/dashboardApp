import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

// The tools that open as their own screen (files in src/app/).
// This list is the single place that knows them: app/_layout.tsx registers the
// screens from it and the Tools tab builds its links from it.
// The groups on the Tools tab, in the order they show.
export const TOOL_GROUPS = ["Network", "Security", "Converters", "Developer", "Reference"] as const;
export type ToolGroupName = (typeof TOOL_GROUPS)[number];

export type ToolRoute = {
  name: string;
  title: string;
  blurb: string;
  group: ToolGroupName;
  icon: ComponentProps<typeof Ionicons>["name"];
};

export const TOOL_ROUTES: ToolRoute[] = [
  {
    name: "JsonFormatter",
    title: "JSON Formatter",
    blurb: "Format, minify, fix errors",
    group: "Developer",
    icon: "document-text-outline",
  },
  {
    name: "RegexTester",
    title: "Regex Tester",
    blurb: "Live matches, highlighted",
    group: "Developer",
    icon: "code-slash-outline",
  },
  {
    name: "DiffChecker",
    title: "Diff Checker",
    blurb: "Compare two texts",
    group: "Developer",
    icon: "git-compare-outline",
  },
  {
    name: "Encryption",
    title: "Encrypt / Decrypt",
    blurb: "AES-256, on the device",
    group: "Security",
    icon: "lock-closed-outline",
  },
  {
    name: "HttpStatus",
    title: "HTTP Status Codes",
    blurb: "Every code explained",
    group: "Reference",
    icon: "globe-outline",
  },
  {
    name: "GitCheatsheet",
    title: "Git Cheatsheet",
    blurb: "Tap a command to copy",
    group: "Reference",
    icon: "git-branch-outline",
  },
];
