import { useMemo, useState } from "react";
import { Text } from "react-native";

import Panel from "@/components/ctos/Panel";
import {
  FLAG_LIST,
  MAX_MATCHES,
  runRegex,
  splitByMatches,
  type RegexFlag,
} from "@/features/tools/logic/regex";
import {
  Chip,
  ChipRow,
  Field,
  Hint,
  ResultRow,
  Stack,
  Status,
  Sub,
  ToolScreen,
} from "@/features/tools/toolKit";
import kit from "@/features/tools/toolKitStyles";

const SHOWN_MATCHES = 30; // the list below the text; the highlighting shows all of them

const FLAG_HINT: Record<RegexFlag, string> = {
  g: "ALL MATCHES",
  i: "IGNORE CASE",
  m: "^ $ PER LINE",
  s: ". MATCHES NEW LINE",
  u: "UNICODE",
};

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<RegexFlag[]>(["g"]);
  const [text, setText] = useState("");

  const result = useMemo(() => runRegex(pattern, flags, text), [pattern, flags, text]);
  const segments = useMemo(() => splitByMatches(text, result.matches), [text, result.matches]);

  const toggleFlag = (f: RegexFlag) =>
    setFlags((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  const count = result.matches.length;

  return (
    <ToolScreen title="Regex Tester">
      <Panel title="PATTERN">
        <Stack>
          <Field label="REGEX" value={pattern} onChangeText={setPattern} placeholder="(\d+)-(\w+)" />
          <ChipRow>
            {FLAG_LIST.map((f) => (
              <Chip key={f} label={f} active={flags.includes(f)} onPress={() => toggleFlag(f)} />
            ))}
          </ChipRow>
          <Hint>{flags.map((f) => `${f} = ${FLAG_HINT[f]}`).join(" · ") || "NO FLAGS: FIRST MATCH ONLY"}</Hint>
          {result.error ? <Status tone="error">{result.error.toUpperCase()}</Status> : null}
        </Stack>
      </Panel>

      <Panel title="TEST TEXT">
        <Stack>
          <Field label="TEXT" value={text} onChangeText={setText} placeholder="text to search" multiline />
          {pattern && text && !result.error ? (
            <Status tone={count > 0 ? "ok" : "warn"}>
              {count === 0 ? "NO MATCHES" : `${count}${result.truncated ? "+" : ""} MATCH${count > 1 ? "ES" : ""}`}
            </Status>
          ) : null}
          {count > 0 ? (
            <Text style={kit.blockText} selectable>
              {segments.map((s, i) => (
                <Text key={i} style={s.hit ? kit.hit : undefined}>
                  {s.text}
                </Text>
              ))}
            </Text>
          ) : null}
        </Stack>
      </Panel>

      {count > 0 ? (
        <Panel title="MATCHES">
          <Stack>
            {result.matches.slice(0, SHOWN_MATCHES).map((m, i) => (
              <ResultRow
                key={i}
                label={`${i + 1} · AT ${m.index}`}
                value={[m.text === "" ? "(EMPTY)" : m.text, ...m.groups.map((g, k) => `$${k + 1} = ${g ?? "—"}`)].join("\n")}
              />
            ))}
            {count > SHOWN_MATCHES ? <Sub>{`${count - SHOWN_MATCHES} MORE NOT LISTED`}</Sub> : null}
            {result.truncated ? <Hint>STOPPED AT {MAX_MATCHES} MATCHES.</Hint> : null}
          </Stack>
        </Panel>
      ) : null}
    </ToolScreen>
  );
}
