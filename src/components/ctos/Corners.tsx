import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { hud, hudDNG } from "@/style/globalStyles";

const LEN = 10;

// Corner marks for a panel: bright top-right, dim bottom-left.
// Drop it as the LAST child of any card: <View style={card}>...<Corners /></View>
export default function Corners({isDanger=false, flash=false}:{isDanger?:boolean; flash?:boolean}) {
  return (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.mark,
          styles.topRight,
          isDanger && { borderColor: hudDNG.bracket },
          flash && styles.flash,
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.mark,
          styles.bottomLeft,
          isDanger && { borderColor: hudDNG.edge },
          flash && styles.flash,
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // a short green pulse after something saved
  flash: { borderColor: Colors.success, borderWidth: 2 },
  mark: { position: "absolute", width: LEN, height: LEN },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: hud.bracket,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: hud.edge,
  },
});
