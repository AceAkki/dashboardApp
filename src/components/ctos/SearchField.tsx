import { Text, TextInput, View, type TextInputProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { fieldStyles, hitSlop, chipStyles } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = Omit<TextInputProps, "style" | "onChangeText" | "value"> & {
  value: string;
  onChangeText: (v: string) => void;
};

// `/ search…` box with CLEAR inside. Used by every list that can be filtered.
export default function SearchField({ value, onChangeText, placeholder = "search…", ...rest }: Props) {
  return (
    <View style={fieldStyles.search}>
      <Text style={fieldStyles.searchSlash}>/</Text>
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        cursorColor={Colors.primary}
        selectionColor={Colors.primary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={fieldStyles.searchInput}
        accessibilityLabel={placeholder}
      />
      {value ? (
        <CtosPressable
          haptic="tap"
          hitSlop={hitSlop}
          pressedStyle={{ opacity: 0.5 }}
          onPress={() => onChangeText("")}
          accessibilityLabel="Clear search"
        >
          <Text style={[chipStyles.label, { color: Colors.primary }]}>CLEAR</Text>
        </CtosPressable>
      ) : null}
    </View>
  );
}
