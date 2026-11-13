import type { snippetType } from "./toolTypes";

// Tags are one short lowercase word: "#Git Stuff" -> "git-stuff". Empty means no tag.
export const cleanTag = (raw: unknown): string | undefined => {
  if (typeof raw !== "string") return undefined;
  const t = raw
    .trim()
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 24);
  return t || undefined;
};

export type TagCount = { tag: string; count: number };

// the tags in use, most used first. Nothing to manage: a tag exists while a snippet has it.
export const tagCounts = (snippets: snippetType[]): TagCount[] => {
  const map = new Map<string, number>();
  for (const s of snippets) if (s.tag) map.set(s.tag, (map.get(s.tag) ?? 0) + 1);
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};

// tag = null means all. The query matches the title, the text and the tag.
export const filterSnippets = (
  snippets: snippetType[],
  tag: string | null,
  query: string,
) => {
  const q = query.trim().toLowerCase();
  return snippets.filter(
    (s) =>
      (!tag || s.tag === tag) &&
      (!q || `${s.title}\n${s.code}\n${s.tag ?? ""}`.toLowerCase().includes(q)),
  );
};
