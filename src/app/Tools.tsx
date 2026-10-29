import { ScrollView, Text, View } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import globalStyles from "@/style/globalStyles";
import FavLinks from "@/features/favLinks/FavLinks";
import {
  SnippetsPanel,
  StandupPanel,
  TerminalPanel,
} from "@/features/tools/components";
import toolsStyles from "@/features/tools/toolsStyles";

export default function Tools() {
  return (
    <CtosScreen nav>
      <ScrollView
        contentContainerStyle={toolsStyles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={globalStyles.sectionLabel}>{"// Toolkit"}</Text>
          <CtosText style={[globalStyles.textHeading, { marginTop: 6 }]}>
            Stack
          </CtosText>
        </View>
        <TerminalPanel />
        <StandupPanel />
        <SnippetsPanel />
        <FavLinks />
      </ScrollView>
    </CtosScreen>
  );
}
