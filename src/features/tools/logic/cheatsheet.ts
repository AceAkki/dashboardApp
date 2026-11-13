// Shared shape + search for every cheatsheet (JS, Python, ...).
// Same shape as the Git cheatsheet, so Git can use this screen too.
export type CheatItem = { cmd: string; note: string };
export type CheatSection = { title: string; items: CheatItem[] };

// matches the snippet or its note; sections with no match are dropped
export function searchCheatsheet(sections: CheatSection[], query: string): CheatSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return sections;
  return sections
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => i.cmd.toLowerCase().includes(q) || i.note.toLowerCase().includes(q)),
    }))
    .filter((s) => s.items.length > 0);
}
