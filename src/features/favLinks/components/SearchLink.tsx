import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import type { SearchLinkProps } from "../favLinkTypes";
import favLinksStyles from "../favLinksStyles";

type Props = SearchLinkProps & { engineName: string };

const SearchLink = ({ search, setSearch, onSubmit, engineName }: Props) => {
  const [focused, setFocused] = useState(false);
  const canSubmit = search.query.trim().length > 0;

  return (
    <View
      style={[
        favLinksStyles.searchBar,
        focused && favLinksStyles.searchBarFocused,
      ]}
    >
      <Ionicons name="search" size={18} color={Colors.textSecondary} />
      <TextInput
        style={favLinksStyles.searchInput}
        placeholder={`Search with ${engineName}`}
        placeholderTextColor={Colors.textMuted}
        value={search.query}
        onChangeText={(query) => setSearch((prev) => ({ ...prev, query }))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={() => canSubmit && onSubmit()}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        // keep the keyboard Enter from doing nothing when the box is empty
        enablesReturnKeyAutomatically
      />
      {search.query.length > 0 && (
        <Pressable
          style={favLinksStyles.clearBtn}
          onPress={() => setSearch((prev) => ({ ...prev, query: "" }))}
          hitSlop={8}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </Pressable>
      )}
      <Pressable
        style={[
          favLinksStyles.goBtn,
          !canSubmit && favLinksStyles.goBtnDisabled,
        ]}
        onPress={onSubmit}
        disabled={!canSubmit}
        accessibilityLabel={`Search with ${engineName}`}
      >
        <Ionicons name="arrow-forward" size={18} color={Colors.textOnPrimary} />
      </Pressable>
    </View>
  );
};

export default SearchLink;
