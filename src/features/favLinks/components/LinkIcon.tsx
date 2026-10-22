import { useState } from "react";
import { Image, Text, View } from "react-native";

import favLinksStyles from "../favLinksStyles";

type Props = { uri: string; name: string; size?: number };

// favicon with a letter fallback if the image fails to load (offline, blocked)
const LinkIcon = ({ uri, name, size = 20 }: Props) => {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: size / 2 };

  if (failed) {
    return (
      <View style={[favLinksStyles.icon, favLinksStyles.iconFallback, box]}>
        <Text style={favLinksStyles.iconFallbackTxt}>{name.charAt(0)}</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={[favLinksStyles.icon, box]}
      onError={() => setFailed(true)}
      accessibilityLabel={name}
    />
  );
};

export default LinkIcon;
