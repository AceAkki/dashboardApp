import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles, {colors} from "@/style/globalStyles";
import homeStyles from "@/style/homeStyles";

export default function Index() {
  return (
    <SafeAreaView style={globalStyles.containerFull}>
      <View style={[globalStyles.container, {backgroundColor:colors.peach}]}>
        <Text style={homeStyles.greet}>
          Good Morning, 
          <Text style={homeStyles.greetName}>
          User
          </Text>
        </Text>
      </View>
      <View style={{ flexDirection: 'row',justifyContent:"space-between", paddingHorizontal:20, paddingVertical:10}}>
        <Text>
          Menu
        </Text>
        <Text>
          User
        </Text>
      </View>
    </SafeAreaView>
  );
}

