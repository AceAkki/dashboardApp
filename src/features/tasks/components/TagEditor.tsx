import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import globalStyles, { fieldBase, text } from "@/style/globalStyles";
import { MAX_TAGS, addTag } from "../taskTags";

// State for one tag field. `final` is what to save: the chips plus a half-typed tag,
// so pressing Save with "work" still in the box does not lose it.
export function useTagField(initial: string[] = []) {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");
  return {
    tags,
    setTags,
    draft,
    setDraft,
    final: addTag(tags, draft),
    reset: () => {
      setTags([]);
      setDraft("");
    },
  };
}
export type TagField = ReturnType<typeof useTagField>;

type Props = {
  field: TagField;
  /** tags already used on other tasks, offered as tap-to-add */
  known: string[];
};

export default function TagEditor({ field, known }: Props) {
  const { tags, setTags, draft, setDraft } = field;
  const full = tags.length >= MAX_TAGS;
  const suggestions = known.filter((t) => !tags.includes(t)).slice(0, 8);

  const commit = (raw: string) => {
    setTags(addTag(tags, raw));
    setDraft("");
  };

  return (
    <View style={s.wrap}>
      <Text style={text.caption}>TAGS</Text>
      <View style={s.row}>
        {tags.map((t) => (
          <CtosPressable
            haptic="select"
            key={t}
            style={[globalStyles.chip, globalStyles.chipActive]}
            onPress={() => setTags(tags.filter((x) => x !== t))}
            accessibilityRole="button"
            accessibilityLabel={`Remove tag ${t}`}
          >
            <Text style={[globalStyles.textSmall, { color: Colors.primary }]}>
              #{t} ×
            </Text>
          </CtosPressable>
        ))}
        {full ? (
          <Text style={text.caption}>MAX {MAX_TAGS}</Text>
        ) : (
          <FocusInput
            style={s.input}
            value={draft}
            onChangeText={(v) => (/[,\s]$/.test(v) ? commit(v) : setDraft(v))}
            onSubmitEditing={() => commit(draft)}
            placeholder="add tag…"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={30}
            returnKeyType="done"
            accessibilityLabel="Add tag"
          />
        )}
      </View>

      {suggestions.length > 0 && !full ? (
        <>
          <Text style={text.caption}>YOUR TAGS</Text>
          <View style={s.row}>
            {suggestions.map((t) => (
              <CtosPressable
                haptic="select"
                key={t}
                style={globalStyles.chip}
                onPress={() => setTags(addTag(tags, t))}
                accessibilityRole="button"
                accessibilityLabel={`Add tag ${t}`}
              >
                <Text style={globalStyles.textSmall}>#{t}</Text>
              </CtosPressable>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  input: { ...fieldBase, flex: 1, minWidth: 110, paddingVertical: 6 },
});
