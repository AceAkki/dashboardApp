// One set of tag rules for the whole app: tasks and snippets both use these.
// A tag is one short lowercase word: "#Git Stuff" -> "git-stuff". Letters of any language are kept.

export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 24;

export type TagCount = { tag: string; count: number };

// characters that never belong in a tag (spaces become "-" first)
const BANNED = /[#,;:!?.'"`()[\]{}<>\\/|@$%^&*+=~]/g;

export const cleanTag = (raw: unknown): string | undefined => {
  if (typeof raw !== "string") return undefined;
  const t = raw
    .trim()
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(BANNED, "")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+/, "")
    .slice(0, MAX_TAG_LENGTH)
    .replace(/[-_]+$/, "");
  return t || undefined;
};

// a list of tags: cleaned, no duplicates, at most MAX_TAGS
export const cleanTags = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const r of raw) {
    const t = cleanTag(r);
    if (t && !out.includes(t)) out.push(t);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
};

// the list with one more tag, or the same list when it is empty, a duplicate or the list is full
export const addTag = (tags: string[], raw: unknown): string[] => {
  const t = cleanTag(raw);
  if (!t || tags.includes(t) || tags.length >= MAX_TAGS) return tags;
  return [...tags, t];
};

// the tags in use across a list of items, most used first. A tag exists while an item has it.
export const countTags = (items: { tags?: string[] }[]): TagCount[] => {
  const map = new Map<string, number>();
  for (const it of items) for (const tag of it.tags ?? []) map.set(tag, (map.get(tag) ?? 0) + 1);
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};

// "#work" and "work" search the same
export const searchText = (query: string) => query.trim().toLowerCase().replace(/^#/, "");
