import { Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { text } from "@/style/globalStyles";

type Props = { label: string; color?: string };

// small boxed status word: ONLINE, 03 OPEN, NEW ...
export default function Tag({ label, color = Colors.primary }: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <Text style={[text.caption, { color }]}>{label}</Text>
    </View>
  );
}
