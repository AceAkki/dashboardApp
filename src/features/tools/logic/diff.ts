export type DiffLine = { kind: "same" | "add" | "del"; text: string };

export const MAX_LINES = 1500;

// Line by line comparison using the longest common subsequence (LCS):
// lines that appear in both texts, in the same order, are "same".
// Everything else is "del" (only in the old text) or "add" (only in the new one).
export function diffLines(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split(/\r?\n/);
  const b = newText.split(/\r?\n/);
  if (a.length > MAX_LINES || b.length > MAX_LINES) {
    throw new Error(`TOO LONG (MAX ${MAX_LINES} LINES EACH)`);
  }

  // the start and end that did not change need no table, and this keeps the table small
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);
  const n = midA.length;
  const m = midB.length;
  const W = m + 1;

  // table[i][j] = length of the common part of midA[i..] and midB[j..]
  const table = new Uint16Array((n + 1) * W);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i * W + j] =
        midA[i] === midB[j]
          ? table[(i + 1) * W + j + 1] + 1
          : Math.max(table[(i + 1) * W + j], table[i * W + j + 1]);
    }
  }

  const out: DiffLine[] = a.slice(0, start).map((text) => ({ kind: "same", text }));
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (midA[i] === midB[j]) {
      out.push({ kind: "same", text: midA[i] });
      i++;
      j++;
    } else if (table[(i + 1) * W + j] >= table[i * W + j + 1]) {
      out.push({ kind: "del", text: midA[i++] });
    } else {
      out.push({ kind: "add", text: midB[j++] });
    }
  }
  while (i < n) out.push({ kind: "del", text: midA[i++] });
  while (j < m) out.push({ kind: "add", text: midB[j++] });
  for (const text of a.slice(endA)) out.push({ kind: "same", text });
  return out;
}

export function diffStats(lines: DiffLine[]) {
  return {
    added: lines.filter((l) => l.kind === "add").length,
    removed: lines.filter((l) => l.kind === "del").length,
  };
}
