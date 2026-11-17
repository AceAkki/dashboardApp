import { StyleSheet, View } from "react-native";

import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import SearchField from "@/components/ctos/SearchField";
import { screenPad, spacing } from "@/style/globalStyles";
import type { TagCount } from "../taskTags";

type Props = {
  query: string;
  onQuery: (q: string) => void;
  /** tags in use, most used first (counts are over all tasks, in every tab) */
  tags: TagCount[];
  total: number;
  /** the chosen tag, null = all */
  picked: string | null;
  onPick: (tag: string | null) => void;
};

// Search box and a row of tag chips. Lives under the tabs.
// Keep this a stand-alone component: defined inside the screen it would be rebuilt
// on every keystroke and the search box would lose focus.
export default function TaskFilters({ query, onQuery, tags, total, picked, onPick }: Props) {
  const chips: { tag: string | null; count: number }[] = [{ tag: null, count: total }, ...tags];

  return (
    <View style={s.wrap}>
      <SearchField value={query} onChangeText={onQuery} placeholder="search tasks…" />
      {tags.length > 0 ? (
        <ChipRow layout="scroll">
          {chips.map((c) => (
            <Chip
              key={c.tag ?? "all"}
              label={`#${c.tag ?? "all"}`}
              count={c.count}
              selected={c.tag === picked}
              onPress={() => onPick(c.tag)}
            />
          ))}
        </ChipRow>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: screenPad, marginBottom: 10, gap: spacing.md - 2 },
});
