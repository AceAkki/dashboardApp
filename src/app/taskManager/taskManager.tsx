import {Text, View,  Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";

import globalStyles from "@/style/globalStyles";
import taskManagerStyles from "./taskManagerStyles";

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
