import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles from "@/style/globalStyles";
import BentoStructure from "../features/dashboard/BentoStructure";

export default function Index() {
  return (
    <SafeAreaView style={globalStyles.screen} edges={["top", "bottom"]}>
      <BentoStructure />
    </SafeAreaView>
  );
}
