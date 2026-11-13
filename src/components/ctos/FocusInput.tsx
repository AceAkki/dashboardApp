import { useEffect, useState } from "react";
import { Animated, StyleSheet, TextInput, type TextInputProps } from "react-native";

import { Colors } from "@/constants/Colors";

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type Props = TextInputProps & {
  /** turns the border red and shakes the field once when it becomes true */
  error?: boolean;
};

// Drop-in <TextInput>: cyan border + cyan caret while focused, red border and a short shake on error.
export default function FocusInput({ style, error, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [x] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!error) return;
    const move = (to: number) => Animated.timing(x, { toValue: to, duration: 45, useNativeDriver: true });
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
      style={[style, focused && styles.focus, error && styles.error, { transform: [{ translateX: x }] }]}
    />
  );
}

const styles = StyleSheet.create({
  focus: { borderColor: Colors.primary, backgroundColor: "#00E5FF0F" },
  error: { borderColor: Colors.danger },
});
