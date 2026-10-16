import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles from "@/style/globalStyles";
import headerStyles from "@/style/headerStyles";

export default function Header() {
  return (
    <SafeAreaView style={globalStyles.containerFull}>
      <View style={headerStyles.header}>
        <View style={headerStyles.menuButton}></View>
        <Image
          source={{ uri: "https://i.pravatar.cc/120?img=12" }}
          style={headerStyles.avatar}
        />
      </View>
    </SafeAreaView>
  );
}
