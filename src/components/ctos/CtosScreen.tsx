import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import globalStyles from "@/style/globalStyles";
import GridBackground from "./GridBackground";
import CtosNavBar from "./CtosNavBar";

type Props = {
  children?: ReactNode;
  /** shows the bottom navigation */
  nav?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

// Screen shell: dark canvas + grid + safe area (+ optional nav bar).
// Content inside should stay transparent so the grid shows through.
export default function CtosScreen({
  children,
  nav = false,
  edges = ["top", "bottom"],
  style,
}: Props) {
  return (
    <SafeAreaView style={[globalStyles.screen, style]} edges={edges}>
      <GridBackground />
      <View style={{ flex: 1 }}>{children}</View>
      {nav ? <CtosNavBar /> : null}
    </SafeAreaView>
  );
}
