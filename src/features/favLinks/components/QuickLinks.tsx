import { FlatList, Pressable, Text, View } from "react-native";

import { favLinks } from "../favLinksData";
import { openLink } from "../utils/openLink";
import favLinksStyles from "../favLinksStyles";
import LinkIcon from "./LinkIcon";

// the old "StaticLinks": no query needed, one tap opens the site
const QuickLinks = () => (
  <FlatList
    data={favLinks.StaticLinks}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(link) => link.name}
    contentContainerStyle={favLinksStyles.chipsList}
    keyboardShouldPersistTaps="handled"
    renderItem={({ item }) => {
      return (
        <Pressable
          key={item.name}
          onPress={() => openLink(item.searchURL, item.name)}
          accessibilityRole="link"
          accessibilityLabel={`Open ${item.name}`}
          style={({ pressed }) => [
            favLinksStyles.quickItem,
            pressed && favLinksStyles.quickItemPressed,
          ]}
        >
          <LinkIcon uri={item.favicon} name={item.name} size={32} />
          <Text style={favLinksStyles.quickTxt} numberOfLines={1}>
            {item.name}
          </Text>
        </Pressable>
      );
    }}
  />
);

export default QuickLinks;
