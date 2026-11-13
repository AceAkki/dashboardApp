import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { Colors } from "@/constants/Colors";
import { feedback } from "@/global/useFeedback";

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** what the press feels like: a light tap (default), a selection tick (chips, tabs) or nothing */
  haptic?: "tap" | "select" | "none";
  /** how it looks while held down; default is the cyan flash */
  pressedStyle?: StyleProp<ViewStyle>;
};

// Drop-in <Pressable>: cyan flash while pressed + a haptic on press.
// Swap it in anywhere a Pressable is a button; style / onPress / hitSlop work as before.
export default function CtosPressable({
  style,
  pressedStyle,
  haptic = "tap",
  onPress,
  ...rest
}: Props) {
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        if (haptic === "tap") feedback.tap();
        else if (haptic === "select") feedback.select();
        onPress?.(e);
      }}
      style={({ pressed }) => [style, pressed && (pressedStyle ?? styles.pressed)]}
    />
  );
}

const styles = StyleSheet.create({
  pressed: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
});
