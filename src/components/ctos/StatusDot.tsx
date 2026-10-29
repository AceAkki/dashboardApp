import { View } from "react-native";

import { Colors } from "@/constants/Colors";

// square status marker 
export default function StatusDot({ color = Colors.primary, size = 7 }: { color?: string; size?: number }) {
  return <View style={{ width: size, height: size, backgroundColor: color }} />;
}
