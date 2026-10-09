import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles, {colors} from "@/style/globalStyles";
import homeStyles from "@/style/homeStyles";

export default function Index() {
  return (
    <SafeAreaView>
      <View style={[globalStyles.container, {backgroundColor:colors.bg, paddingHorizontal:20, paddingTop:80}]}>
        <Text>
          Good Morning, 
          <Text style={homeStyles.greetName}>
          User

          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

