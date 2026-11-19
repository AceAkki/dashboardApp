import { MAX_TAGS, addTag, cleanTags, countTags, searchText, type TagCount } from "@/global/tagRules";
import type { TaskActionData } from "./taskTypes";

export const MAX_NOTE = 280;

// the tag rules are shared with snippets (global/tagRules.ts)
export { MAX_TAGS, addTag, cleanTags };
export type { TagCount };

// a note is plain text, trimmed and capped. Empty means no note.
export const cleanNote = (raw: unknown): string | undefined => {
  if (typeof raw !== "string") return undefined;
  const n = raw.trim().slice(0, MAX_NOTE);
  return n || undefined;
};

// the tags in use across ALL tasks, most used first
export const tagCounts = (tasks: TaskActionData[]): TagCount[] => countTags(tasks);

// tag = null means any tag. The query matches the title, the note and the tags ("#work" works too).
export const matchTasks = (
  tasks: TaskActionData[],
  tag: string | null,
  query: string,
) => {
  const q = searchText(query);
  return tasks.filter(
    (t) =>
      (!tag || t.tags?.includes(tag)) &&
      (!q ||
        `${t.taskName}\n${t.note ?? ""}\n${(t.tags ?? []).join(" ")}`
          .toLowerCase()
          .includes(q)),
  );
};
