import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { chipStyles, fontSize, hitSlop, iconSize } from "@/style/globalStyles";
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
  const box = [
    chipStyles.box,
    size === "sm" && chipStyles.boxSm,
    selected && chipStyles.selected,
    disabled && chipStyles.disabled,
  ];
  const content = (
    <>
      {left}
      <Text
        style={[
          chipStyles.label,
          size === "sm" && { fontSize: fontSize.xs },
          selected && chipStyles.labelSelected,
        ]}
        numberOfLines={1}
      >
        {label}
        {count != null ? <Text style={chipStyles.count}>{` ${count}`}</Text> : null}
      </Text>
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
      style={box}
      pressedStyle={chipStyles.pressed}
    >
      {content}
    </CtosPressable>
  );
}
