import { useEffect, useState, type ReactNode } from "react";
import { Animated, Text, View } from "react-native";

import { chipStyles, fontSize, hitSlop, iconSize, motion } from "@/style/globalStyles";
import { ease } from "@/global/motion";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CtosPressable from "./CtosPressable";

type Props = {
  label: string;
  selected?: boolean;
  /** small number after the label, e.g. tag usage */
  count?: number;
  /** shows a × that calls this */
  onRemove?: () => void;
  /** omit for a read-only tag */
  onPress?: () => void;
  size?: "md" | "sm";
  disabled?: boolean;
  left?: ReactNode;
};

// Filter / tag / action chip. Selected = cyan fill + border + glow.
export default function Chip({
  label,
  selected = false,
  count,
  onRemove,
  onPress,
  size = "md",
  disabled = false,
  left,
}: Props) {
  // 0 = idle, 1 = selected; colours fade between the two instead of snapping
  const [fade] = useState(() => new Animated.Value(selected ? 1 : 0));
  useEffect(() => {
    ease(fade, selected ? 1 : 0, motion.fade, false);
  }, [selected, fade]);
  const mix = (a: string, b: string) => fade.interpolate({ inputRange: [0, 1], outputRange: [a, b] });

  const box = [
    chipStyles.box,
    size === "sm" && chipStyles.boxSm,
    selected && chipStyles.selected,
    disabled && chipStyles.disabled,
  ];
  const content = (
    <>
      {left}
      <Animated.Text
        style={[
          chipStyles.label,
          size === "sm" && { fontSize: fontSize.xs },
          onPress
            ? { color: mix(Colors.textSecondary, Colors.primary) }
            : selected && chipStyles.labelSelected,
        ]}
        numberOfLines={1}
      >
        {label}
        {count != null ? <Text style={chipStyles.count}>{` ${count}`}</Text> : null}
      </Animated.Text>
      {onRemove ? (
        <CtosPressable
          haptic="tap"
          hitSlop={hitSlop}
          onPress={onRemove}
          disabled={disabled}
          accessibilityLabel={`Remove ${label}`}
          pressedStyle={{ opacity: 0.5 }}
        >
          <Ionicons
            name="close"
            size={iconSize.sm}
            color={selected ? Colors.primary : Colors.textSecondary}
          />
        </CtosPressable>
      ) : null}
    </>
  );

  if (!onPress) return <View style={box}>{content}</View>;

  return (
    <CtosPressable
      haptic="select"
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={[
        box,
        { backgroundColor: mix(Colors.secondarySoft, Colors.primarySoft), borderColor: mix(Colors.border, Colors.primary) },
      ]}
      pressedStyle={chipStyles.pressed}
    >
      {content}
    </CtosPressable>
  );
}
