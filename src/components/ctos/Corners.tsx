import { StyleSheet, View } from "react-native";

import { hud } from "@/style/globalStyles";

const LEN = 10;

// Corner marks for a panel: bright top-right, dim bottom-left.
// Drop it as the LAST child of any card: <View style={card}>...<Corners /></View>
export default function Corners() {
  return (
    <>
      <View pointerEvents="none" style={[styles.mark, styles.topRight]} />
      <View pointerEvents="none" style={[styles.mark, styles.bottomLeft]} />
    </>
  );
}

const styles = StyleSheet.create({
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
