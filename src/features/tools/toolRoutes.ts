import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

// The tools that open as their own screen (files in src/app/).
// This list is the single place that knows them: app/_layout.tsx registers the
// screens from it and the Tools tab builds its links from it.
export type ToolRoute = {
  name: string;
  title: string;
  blurb: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

export const TOOL_ROUTES: ToolRoute[] = [
  {
    name: "JsonFormatter",
    title: "JSON Formatter",
    blurb: "Format, minify, find the broken comma",
    icon: "document-text-outline",
  },
  {
    name: "RegexTester",
    title: "Regex Tester",
    blurb: "Live matches with groups, highlighted",
    icon: "code-slash-outline",
  },
  {
    name: "DiffChecker",
    title: "Diff Checker",
    blurb: "Compare two texts line by line",
    icon: "git-compare-outline",
  },
  {
    name: "Encryption",
    title: "Encrypt / Decrypt",
    blurb: "AES-256 with a passphrase, on the device",
    icon: "lock-closed-outline",
  },
  {
    name: "HttpStatus",
    title: "HTTP Status Codes",
    blurb: "Every code and what it means",
    icon: "globe-outline",
  },
  {
    name: "GitCheatsheet",
    title: "Git Cheatsheet",
    blurb: "Commands you forget, tap to copy",
    icon: "git-branch-outline",
  },
];
