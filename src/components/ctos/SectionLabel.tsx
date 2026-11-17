import { Text } from "react-native";

import { text } from "@/style/globalStyles";

// UPPERCASE cyan label above a group of cards
export default function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={text.label} accessibilityRole="header">
      {children}
    </Text>
  );
}
