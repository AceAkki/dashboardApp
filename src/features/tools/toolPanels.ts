import type { ComponentProps, ComponentType } from "react";
import type { Ionicons } from "@expo/vector-icons";

import Base64Panel from "./components/Base64Panel";
import ColorPanel from "./components/ColorPanel";
import DiffCheckerPanel from "./components/DiffCheckerPanel";
import EncryptionPanel from "./components/EncryptionPanel";
import GitCheatsheetPanel from "./components/GitCheatsheetPanel";
import HttpStatusPanel from "./components/HttpStatusPanel";
import JsonFormatterPanel from "./components/JsonFormatterPanel";
import RegexTesterPanel from "./components/RegexTesterPanel";
import JsCheatsheetPanel from "./components/JsCheatsheetPanel";
import PythonCheatsheetPanel from "./components/PythonCheatsheetPanel";
import DnsPanel from "./components/DnsPanel";
import HashPanel from "./components/HashPanel";
import IpPortPanel from "./components/IpPortPanel";
import PasswordPanel from "./components/PasswordPanel";
import PingPanel from "./components/PingPanel";
import SslPanel from "./components/SslPanel";
import TimestampPanel from "./components/TimestampPanel";
import UrlPanel from "./components/UrlPanel";
import UuidPanel from "./components/UuidPanel";

// Every tool in the app. Each one is a tile on the Tools tab and opens full screen in app/Tool.tsx
// (/Tool?id=dns). To add a tool: write the panel in components/, add one line to TOOL_PANELS. Nothing else.
// The groups on the Tools tab, in the order they show.
export const TOOL_GROUPS = ["Network", "Security", "Converters", "Developer", "Reference"] as const;
export type ToolGroupName = (typeof TOOL_GROUPS)[number];

export type ToolPanelEntry = {
  id: string;
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  blurb: string;
  group: ToolGroupName;
  Component: ComponentType;
  // true: the panel draws its own Panel sections, so Tool.tsx does not wrap it in one
  bare?: boolean;
};

export const TOOL_PANELS: ToolPanelEntry[] = [
  { id: "ip", title: "IP & PORT CHECK", blurb: "Is a port open on a host", icon: "wifi-outline", group: "Network", Component: IpPortPanel },
  { id: "ping", title: "SERVER PING", blurb: "Latency to a server", icon: "radio-outline", group: "Network", Component: PingPanel },
  { id: "ssl", title: "SSL EXPIRY", blurb: "Certificate days left", icon: "lock-closed", group: "Network", Component: SslPanel },
  { id: "dns", title: "DNS LOOKUP", blurb: "A, MX, TXT records", icon: "globe-outline", group: "Network", Component: DnsPanel },
  { id: "hash", title: "HASH GENERATOR", blurb: "MD5 to SHA-512", icon: "code-working-outline", group: "Security", Component: HashPanel },
  { id: "password", title: "PASSWORD / TOKEN", blurb: "Random keys and tokens", icon: "shield-checkmark-outline", group: "Security", Component: PasswordPanel },
  { id: "uuid", title: "UUID GENERATOR", blurb: "Random unique ids", icon: "barcode-outline", group: "Security", Component: UuidPanel },
  { id: "base64", title: "BASE64", blurb: "Encode and decode", icon: "aperture-outline", group: "Converters", Component: Base64Panel },
  { id: "url", title: "URL ENCODE / DECODE", blurb: "Escape and unescape", icon: "link-outline", group: "Converters", Component: UrlPanel },
  { id: "timestamp", title: "TIMESTAMP CONVERTER", blurb: "Unix time to a date", icon: "time-outline", group: "Converters", Component: TimestampPanel },
  { id: "color", title: "COLOR CONVERTER", blurb: "HEX, RGB, HSL", icon: "color-fill-outline", group: "Converters", Component: ColorPanel },
  { id: "json", title: "JSON FORMATTER", blurb: "Format, minify, fix errors", icon: "document-text-outline", group: "Developer", Component: JsonFormatterPanel, bare: true },
  { id: "regex", title: "REGEX TESTER", blurb: "Live matches, highlighted", icon: "code-slash-outline", group: "Developer", Component: RegexTesterPanel, bare: true },
  { id: "diff", title: "DIFF CHECKER", blurb: "Compare two texts", icon: "git-compare-outline", group: "Developer", Component: DiffCheckerPanel, bare: true },
  { id: "encrypt", title: "ENCRYPT / DECRYPT", blurb: "AES-256, on the device", icon: "lock-closed-outline", group: "Security", Component: EncryptionPanel, bare: true },
  { id: "http", title: "HTTP STATUS CODES", blurb: "Every code explained", icon: "swap-vertical-outline", group: "Reference", Component: HttpStatusPanel, bare: true },
  { id: "git", title: "GIT CHEATSHEET", blurb: "Tap a command to copy", icon: "git-branch-outline", group: "Reference", Component: GitCheatsheetPanel },
  { id: "js", title: "JS CHEATSHEET", blurb: "Tap a snippet to copy", icon: "logo-javascript", group: "Reference", Component: JsCheatsheetPanel },
  { id: "python", title: "PYTHON CHEATSHEET", blurb: "Tap a snippet to copy", icon: "logo-python", group: "Reference", Component: PythonCheatsheetPanel },
];

export const findToolPanel = (id: string | undefined) =>
  TOOL_PANELS.find((t) => t.id === id);
