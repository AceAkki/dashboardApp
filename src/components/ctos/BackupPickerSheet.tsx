import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { pad } from "@/global/dateFormat";
import { fontSize, text } from "@/style/globalStyles";
import CtosText from "../CtosText";
import Button from "./Button";
import ButtonRow from "./ButtonRow";
import Drum, { DRUM_ITEM } from "./Drum";
import Sheet from "./Sheet";

type Props = {
  onCancel: () => void;
  onSet: (newBackup: number) => void;
};

export default function BackUpPickerSheet({onCancel, onSet }: Props) {
  const [newBackup, setnewBackup] = useState(0);
  
  return (
    <Sheet title="PICK Backup Time" onClose={onCancel}>
      <View style={styles.timeRow}>
        <CtosText
          style={[styles.big, styles.bigger]}
        >{`${pad(newBackup)}`}</CtosText>
        
      </View>

      <View style={styles.drums}>
        {/* the band marking the chosen row, behind and across both columns */}
        <View pointerEvents="none" style={styles.band} />
        <Drum label="Hour" count={24} value={newBackup} onChange={setnewBackup} />
       
      </View>
    

      <ButtonRow>
        <Button
          label="Cancel"
          variant="secondary"
          onPress={onCancel}
          style={styles.flex}
        />
        <Button
          label="Set time"
          onPress={() => onSet(newBackup)}
          style={styles.flex}
        />
      </ButtonRow>
    </Sheet>
  );
}

export const styles = StyleSheet.create({
  big: {
    ...text.caption,
    fontFamily: Typography.primary_bold,
    fontSize: fontSize.display_sml,
    letterSpacing: 3,
    color: Colors.primary,
    textAlign: "center",
  },
  bigger: {
    fontSize: fontSize.display,
  },
  drums: { flexDirection: "row", alignItems: "center" },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: DRUM_ITEM * 2,
    height: DRUM_ITEM,
    backgroundColor: Colors.primarySoft,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
  },
  colon: {
    fontFamily: Typography.primary_bold,
    fontSize: fontSize.display_sml,
    color: Colors.primary,
    width: 24,
    textAlign: "center",
  },
  heads: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -4,
  },
  group: { gap: 8 },
  flex: { flex: 1 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
