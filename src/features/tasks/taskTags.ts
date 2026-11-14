import { cleanTag } from "@/features/tools/snippetTags";
import type { TaskActionData } from "./taskTypes";

export const MAX_NOTE = 280;
export const MAX_TAGS = 5;

// a note is plain text, trimmed and capped. Empty means no note.
export const cleanNote = (raw: unknown): string | undefined => {
  if (typeof raw !== "string") return undefined;
  const n = raw.trim().slice(0, MAX_NOTE);
  return n || undefined;
};

// same tag rules as the snippet vault ("#Git Stuff" -> "git-stuff"), no duplicates, at most MAX_TAGS
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

export type TagCount = { tag: string; count: number };

// the tags in use across ALL tasks, most used first. A tag exists while a task has it.
export const tagCounts = (tasks: TaskActionData[]): TagCount[] => {
  const map = new Map<string, number>();
  for (const t of tasks)
    for (const tag of t.tags ?? []) map.set(tag, (map.get(tag) ?? 0) + 1);
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};

// tag = null means any tag. The query matches the title, the note and the tags ("#work" works too).
export const matchTasks = (
  tasks: TaskActionData[],
  tag: string | null,
  query: string,
) => {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  return tasks.filter(
    (t) =>
      (!tag || t.tags?.includes(tag)) &&
      (!q ||
        `${t.taskName}\n${t.note ?? ""}\n${(t.tags ?? []).join(" ")}`
          .toLowerCase()
          .includes(q)),
  );
};
