import { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";


import CtosText from "@/components/CtosText";

import gitStatsStyles from "./gitStatsStyles";

const GitStats = () => {
  return (
    <View style={gitStatsStyles.cardBase}>
      <View>
        <CtosText style={gitStatsStyles.sectionLabel}>Search engine</CtosText>
      </View>
    </View>
  );
};

export default GitStats;
