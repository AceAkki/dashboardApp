import { StyleSheet, View } from "react-native";

import Button from "@/components/ctos/Button";
import SearchField from "@/components/ctos/SearchField";
import { spacing } from "@/style/globalStyles";
import type { SearchLinkProps } from "../favLinkTypes";

type Props = SearchLinkProps & { engineName: string };

// the search box and a GO button; GO and the keyboard Enter both run the search
const SearchLink = ({ search, setSearch, onSubmit, engineName }: Props) => {
  const canSubmit = search.query.trim().length > 0;

  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        <SearchField
          value={search.query}
          onChangeText={(query) => setSearch((prev) => ({ ...prev, query }))}
          placeholder={`search with ${engineName}`}
          onSubmitEditing={() => canSubmit && onSubmit()}
          // keep the keyboard Enter from doing nothing when the box is empty
          enablesReturnKeyAutomatically
        />
      </View>
      <Button label="Go" disabled={!canSubmit} onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
});

export default SearchLink;
