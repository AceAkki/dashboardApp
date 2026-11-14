import { ScrollView, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import globalStyles from "@/style/globalStyles";
import type { TagCount } from "../taskTags";
import taskManagerStyles from "./taskManagerStyles";

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

// "/ search tasks…" box and a row of tag chips. Lives under the tabs.
// Keep this a stand-alone component: defined inside the screen it would be rebuilt
// on every keystroke and the search box would lose focus.
export default function TaskFilters({
  query,
  onQuery,
  tags,
  total,
  picked,
  onPick,
}: Props) {
  const chips: { tag: string | null; count: number }[] = [
    { tag: null, count: total },
    ...tags,
  ];

  return (
    <View style={taskManagerStyles.filters}>
      <View style={taskManagerStyles.search}>
        <Text style={{ color: Colors.primary, fontSize: 16 }}>/</Text>
        <FocusInput
          style={taskManagerStyles.searchInput}
          value={query}
          onChangeText={onQuery}
          placeholder="search tasks…"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search tasks"
        />
        {query ? (
          <Text
            style={{ color: Colors.primary, fontSize: 11, letterSpacing: 1 }}
            onPress={() => onQuery("")}
            suppressHighlighting
          >
            CLEAR
          </Text>
        ) : null}
      </View>

      {tags.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={taskManagerStyles.chipRow}
        >
          {chips.map((c) => {
            const active = c.tag === picked;
            return (
              <CtosPressable
                haptic="select"
                key={c.tag ?? "all"}
                style={[globalStyles.chip, active && globalStyles.chipActive]}
                onPress={() => onPick(c.tag)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    globalStyles.textSmall,
                    active && { color: Colors.primary },
                  ]}
                >
                  #{c.tag ?? "all"} {c.count}
                </Text>
              </CtosPressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}
