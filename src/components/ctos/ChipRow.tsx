import { ScrollView, View } from "react-native";
import { type ReactNode } from "react";

import { chipStyles, screenPad } from "@/style/globalStyles";

type Props = {
  children: ReactNode;
  /** "wrap": several lines; "scroll": one line, swipe sideways */
  layout?: "wrap" | "scroll";
  /** wrap layout only: centre the chips */
  center?: boolean;
};

export default function ChipRow({ children, layout = "wrap", center = false }: Props) {
  if (layout === "wrap")
    return <View style={[chipStyles.wrap, center && { justifyContent: "center" }]}>{children}</View>;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      // vertical room so the glow of a selected chip is not cut off
      contentContainerStyle={[chipStyles.row, { paddingVertical: 4, paddingRight: screenPad }]}
    >
      {children}
    </ScrollView>
  );
}
