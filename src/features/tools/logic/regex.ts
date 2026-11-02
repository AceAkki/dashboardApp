export const FLAG_LIST = ["g", "i", "m", "s", "u"] as const;
export type RegexFlag = (typeof FLAG_LIST)[number];

export const MAX_MATCHES = 500;

export type MatchInfo = { index: number; text: string; groups: (string | undefined)[] };
export type RegexResult = { error: string | null; matches: MatchInfo[]; truncated: boolean };

export function runRegex(pattern: string, flags: RegexFlag[], text: string): RegexResult {
  const empty = { error: null, matches: [], truncated: false };
  if (!pattern) return empty;

  // "g" is always on inside so exec() can walk forward; without the user's "g" we stop after one match
  const wantAll = flags.includes("g");
  let re: RegExp;
  try {
    re = new RegExp(pattern, [...new Set([...flags, "g"])].join(""));
  } catch (e) {
    return { ...empty, error: (e as Error).message.replace(/^Invalid regular expression:?\s*/i, "") };
  }

  const matches: MatchInfo[] = [];
  let truncated = false;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ index: m.index, text: m[0], groups: m.slice(1) });
    if (!wantAll) break;
    if (m[0] === "") re.lastIndex++; // an empty match would loop forever
    if (matches.length >= MAX_MATCHES) {
      truncated = true;
      break;
    }
  }
  return { error: null, matches, truncated };
}

export type Segment = { text: string; hit: boolean };

// cuts the text into pieces, marking which ones are matches (for highlighting)
export function splitByMatches(text: string, matches: MatchInfo[]): Segment[] {
  const out: Segment[] = [];
  let pos = 0;
  for (const m of matches) {
    if (m.text === "") continue;
    if (m.index > pos) out.push({ text: text.slice(pos, m.index), hit: false });
    out.push({ text: m.text, hit: true });
    pos = m.index + m.text.length;
  }
  if (pos < text.length) out.push({ text: text.slice(pos), hit: false });
  return out;
}
