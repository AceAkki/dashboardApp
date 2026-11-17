import { type ReactNode } from "react";
import { Text } from "react-native";

import { fieldStyles } from "@/style/globalStyles";

// the small label over a field or a group of controls (NOTE, TAGS, REMINDER ...)
export default function FieldLabel({ children }: { children: ReactNode }) {
  return <Text style={fieldStyles.label}>{children}</Text>;
}
