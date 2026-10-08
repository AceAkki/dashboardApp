import {Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles from "@/style/globalStyles";

export default function taskManager() {
  return (
    <SafeAreaView>
      <View style={globalStyles.container}>
        <Text>
            Task Manager
        </Text>
        <Text>
          All
        </Text>
        <Text>
          Priority 
        </Text>
        <Text>
          Completed  
        </Text>
      </View>
    </SafeAreaView>
  );
}
