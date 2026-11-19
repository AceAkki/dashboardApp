import { cleanTag, cleanTags, countTags, searchText, type TagCount } from "@/global/tagRules";
import type { snippetType } from "./toolTypes";

export type { TagCount };

// the tags in use across all snippets, most used first
export const tagCounts = (snippets: snippetType[]): TagCount[] => countTags(snippets);

// tag = null means all. The query matches the title, the text and the tags ("#git" works too).
export const filterSnippets = (
  snippets: snippetType[],
  tag: string | null,
  query: string,
) => {
  const q = searchText(query);
  return snippets.filter(
    (s) =>
      (!tag || s.tags?.includes(tag)) &&
      (!q || `${s.title}\n${s.code}\n${(s.tags ?? []).join(" ")}`.toLowerCase().includes(q)),
  );
};

// A snippet from older versions had one `tag`; now it has a list `tags`. Used when loading saved
// data and backups, so nothing is lost.
export const upgradeSnippet = (s: snippetType & { tag?: unknown }): snippetType => {
  const { tag, tags, ...rest } = s as snippetType & { tag?: unknown; tags?: unknown };
  const list = cleanTags(Array.isArray(tags) ? tags : tag ? [tag] : []);
  return list.length ? { ...rest, tags: list } : rest;
};
export { cleanTag };
