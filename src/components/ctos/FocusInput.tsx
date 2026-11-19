import { useEffect, useState } from "react";
import { Animated, StyleSheet, TextInput, type TextInputProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { ease } from "@/global/motion";
import { motion } from "@/style/globalStyles";

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type Props = TextInputProps & {
  /** turns the border red and shakes the field once when it becomes true */
  error?: boolean;
};

// Drop-in <TextInput>: cyan border + cyan caret while focused, red border and a short shake on error.
export default function FocusInput({ style, error, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [x] = useState(() => new Animated.Value(0));
  // 0 = idle, 1 = focused: border and tint fade in instead of switching on
  const [glow] = useState(() => new Animated.Value(0));
  useEffect(() => {
    ease(glow, focused ? 1 : 0, motion.fade, false);
  }, [focused, glow]);

  useEffect(() => {
    if (!error) return;
    const move = (to: number) => Animated.timing(x, { toValue: to, duration: 45, useNativeDriver: false }); // JS-driven: the border fade above is too, and one view can not mix both
    Animated.sequence([move(-6), move(6), move(-4), move(4), move(0)]).start();
  }, [error, x]);

  return (
    <AnimatedInput
      {...rest}
      cursorColor={Colors.primary}
      selectionColor={Colors.primary}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        style,
        {
          borderColor: glow.interpolate({ inputRange: [0, 1], outputRange: [Colors.border, Colors.primary] }),
          backgroundColor: glow.interpolate({ inputRange: [0, 1], outputRange: [Colors.secondarySoft, "#0A282F"] }),
        },
        error && styles.error,
        { transform: [{ translateX: x }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  error: { borderColor: Colors.danger },
});
