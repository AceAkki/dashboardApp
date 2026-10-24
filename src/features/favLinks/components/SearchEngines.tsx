import { FlatList, Pressable } from "react-native";

import CtosText from "@/components/CtosText";
import { favLinks } from "../favLinksData";
import type { SearchEnginesProps } from "../favLinkTypes";
import favLinksStyles from "../favLinksStyles";
import LinkIcon from "./LinkIcon";

// Tapping an engine only selects it. The search runs from the search bar,
// so you can't launch the wrong thing by tapping while typing.
const SearchEngines = ({ selected, onSelect }: SearchEnginesProps) => (
  <FlatList
    data={favLinks.SearchLinks}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(link) => link.name}
    contentContainerStyle={favLinksStyles.chipsList}
    keyboardShouldPersistTaps="handled"
    renderItem={({ item }) => {
      const isSelected = item.name === selected;
      return (
        <Pressable
          onPress={() => onSelect(item.name)}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          style={({ pressed }) => [
            favLinksStyles.chip,
            isSelected && favLinksStyles.chipSelected,
            pressed && favLinksStyles.chipPressed,
          ]}
        >
          <LinkIcon uri={item.favicon} name={item.name} />
          <CtosText
            autoPlay={false}
            trigger={isSelected ? 1 : undefined}
            style={[
              favLinksStyles.chipTxt,
              isSelected && favLinksStyles.chipTxtSelected,
            ]}
          >
            {item.name}
          </CtosText>
        </Pressable>
      );
    }}
  />
);

export default SearchEngines;
