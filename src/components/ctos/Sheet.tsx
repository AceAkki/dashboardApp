import { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { backdropBase, hitSlop, sheetBase, spacing, text } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = {
  onClose: () => void;
  /** `// TITLE` shown in the header, with CLOSE on the right */
  title?: string;
  /** mount it only while open, or pass false to hide */
  visible?: boolean;
  animationType?: "slide" | "fade";
  children: ReactNode;
};

// Bottom sheet: dim backdrop (tap = close), surface card with a cyan top edge, handle,
// header and a scrolling body. Buttons go at the end of the children.
export default function Sheet({
  onClose,
  title,
  visible = true,
  animationType = "slide",
  children,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType={animationType} onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={[StyleSheet.absoluteFill, backdropBase]} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {title ? (
            <View style={styles.head}>
              <Text style={styles.title}>{`// ${title}`}</Text>
              <CtosPressable haptic="select" hitSlop={hitSlop} onPress={onClose} accessibilityRole="button">
                <Text style={text.caption}>CLOSE</Text>
              </CtosPressable>
            </View>
          ) : null}
          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  sheet: { ...sheetBase, maxHeight: "90%", paddingBottom: 0, gap: 0 },
  handle: { alignSelf: "center", width: 36, height: 4, backgroundColor: Colors.border, marginBottom: 14 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { ...text.caption, color: Colors.primary },
  body: { gap: spacing.lg, paddingBottom: 28 },
});
