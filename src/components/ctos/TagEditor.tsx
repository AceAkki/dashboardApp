import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import FieldLabel from "@/components/ctos/FieldLabel";
import FocusInput from "@/components/ctos/FocusInput";
import Hint from "@/components/ctos/Hint";
import { Colors } from "@/constants/Colors";
import { fieldStyles } from "@/style/globalStyles";
import { MAX_TAGS, addTag } from "@/global/tagRules";

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
  /** tags already used elsewhere, offered as tap-to-add */
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
      <FieldLabel>Tags</FieldLabel>
      <ChipRow>
        {tags.map((t) => (
          <Chip key={t} label={`#${t}`} selected onRemove={() => setTags(tags.filter((x) => x !== t))} />
        ))}
        {full ? (
          <Hint>{`MAX ${MAX_TAGS}`}</Hint>
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
      </ChipRow>

      {suggestions.length > 0 && !full ? (
        <>
          <FieldLabel>Your tags</FieldLabel>
          <ChipRow>
            {suggestions.map((t) => (
              <Chip key={t} label={`#${t}`} onPress={() => setTags(addTag(tags, t))} />
            ))}
          </ChipRow>
        </>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 8 },
  input: { ...fieldStyles.input, flex: 1, minWidth: 110, minHeight: 32, paddingVertical: 4 },
});
