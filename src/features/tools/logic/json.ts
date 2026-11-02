export type JsonIndent = 2 | 4 | "\t";
export const INDENTS: { label: string; value: JsonIndent }[] = [
  { label: "2 SPACES", value: 2 },
  { label: "4 SPACES", value: 4 },
  { label: "TAB", value: "\t" },
];

// JSON.parse says "Unexpected token" with no position, and the message differs per engine.
// This walks the text itself so the error always says where it is.
class JsonSyntaxError extends Error {
  constructor(
    message: string,
    public pos: number,
  ) {
    super(message);
  }
}

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

function scan(text: string): void {
  let i = 0;
  const fail = (msg: string): never => {
    throw new JsonSyntaxError(msg, i);
  };
  const skipSpace = () => {
    while (i < text.length && " \t\r\n".includes(text[i])) i++;
  };

  const string = () => {
    i++; // opening quote
    while (i < text.length) {
      const c = text[i];
      if (c === '"') {
        i++;
        return;
      }
      if (c === "\\") {
        if (!text[i + 1] || !'"\\/bfnrtu'.includes(text[i + 1])) fail("BAD ESCAPE IN STRING");
        i += 2;
        continue;
      }
      if (c < " ") fail("LINE BREAK INSIDE A STRING");
      i++;
    }
    fail("UNTERMINATED STRING");
  };

  const value = (): void => {
    skipSpace();
    const c = text[i];
    if (c === "{") return object();
    if (c === "[") return array();
    if (c === '"') return string();
    if (c === "-" || (c >= "0" && c <= "9")) {
      NUMBER.lastIndex = i;
      const m = NUMBER.exec(text);
      if (!m) fail("BAD NUMBER");
      i += m![0].length;
      return;
    }
    for (const word of ["true", "false", "null"]) {
      if (text.startsWith(word, i)) {
        i += word.length;
        return;
      }
    }
    fail(i >= text.length ? "UNEXPECTED END OF TEXT" : `UNEXPECTED '${c}'`);
  };

  const object = () => {
    i++; // {
    skipSpace();
    if (text[i] === "}") {
      i++;
      return;
    }
    for (;;) {
      skipSpace();
      if (text[i] !== '"') fail("EXPECTED A KEY IN DOUBLE QUOTES");
      string();
      skipSpace();
      if (text[i] !== ":") fail("EXPECTED ':' AFTER THE KEY");
      i++;
      value();
      skipSpace();
      if (text[i] === ",") {
        i++;
        continue;
      }
      if (text[i] === "}") {
        i++;
        return;
      }
      fail("EXPECTED ',' OR '}'");
    }
  };

  const array = () => {
    i++; // [
    skipSpace();
    if (text[i] === "]") {
      i++;
      return;
    }
    for (;;) {
      value();
      skipSpace();
      if (text[i] === ",") {
        i++;
        continue;
      }
      if (text[i] === "]") {
        i++;
        return;
      }
      fail("EXPECTED ',' OR ']'");
    }
  };

  value();
  skipSpace();
  if (i < text.length) fail("UNEXPECTED TEXT AFTER THE JSON ENDS");
}

// null = valid, otherwise "LINE 3 · COL 7 · EXPECTED ',' OR '}'"
export function jsonError(text: string): string | null {
  try {
    JSON.parse(text);
    return null;
  } catch (e) {
    try {
      scan(text);
    } catch (err) {
      if (err instanceof JsonSyntaxError) {
        const before = text.slice(0, err.pos).split("\n");
        return `LINE ${before.length} · COL ${before[before.length - 1].length + 1} · ${err.message}`;
      }
    }
    return String((e as Error).message).toUpperCase(); // scan found nothing, use the engine's message
  }
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeys(v)]),
    );
  }
  return value;
}

// Throws if the text is not valid JSON, so check jsonError() first.
export function formatJson(text: string, indent: JsonIndent, sorted: boolean): string {
  const parsed = JSON.parse(text);
  return JSON.stringify(sorted ? sortKeys(parsed) : parsed, null, indent);
}

export function minifyJson(text: string): string {
  return JSON.stringify(JSON.parse(text));
}
