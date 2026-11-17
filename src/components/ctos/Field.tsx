import { type ReactNode } from "react";
import { Text, View, type TextInputProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { fieldStyles } from "@/style/globalStyles";
import FieldLabel from "./FieldLabel";
import FocusInput from "./FocusInput";

type Props = Omit<TextInputProps, "style"> & {
  label?: string;
  /** red message under the field (height of the field does not change) */
  error?: string;
  /** grey message under the field when there is no error */
  help?: string;
  /** shows a green ✓ inside the field */
  valid?: boolean;
  /** shows `28 / 280` under the field; needs value */
  maxCount?: number;
  /** right of the label: PASTE / CLEAR / SHOW actions */
  headerRight?: ReactNode;
  multiline?: boolean;
  disabled?: boolean;
};

// Label over a FocusInput, with state: error (shake + red), valid ✓, disabled, counter.
export default function Field({
  label,
  error,
  help,
  valid,
  maxCount,
  headerRight,
  multiline,
  disabled,
  value,
  ...rest
}: Props) {
  const message = error ?? help;
  return (
    <View style={fieldStyles.wrap}>
      {label || headerRight ? (
        <View style={fieldStyles.head}>
          {label ? <FieldLabel>{label}</FieldLabel> : <View />}
          {headerRight}
        </View>
      ) : null}
      <View style={fieldStyles.box}>
        <FocusInput
          {...rest}
          value={value}
          multiline={multiline}
          editable={!disabled}
          error={!!error}
          maxLength={maxCount}
          placeholderTextColor={Colors.textMuted}
          accessibilityLabel={label}
          style={[
            fieldStyles.input,
            multiline && fieldStyles.inputMulti,
            valid && !error && fieldStyles.inputValid,
            error ? fieldStyles.inputError : null,
            disabled && fieldStyles.inputDisabled,
          ]}
        />
        {valid && !error ? <Text style={fieldStyles.mark}>✓</Text> : null}
      </View>
      {message || maxCount ? (
        <View style={fieldStyles.foot}>
          <Text style={[fieldStyles.message, error ? fieldStyles.messageError : null]}>
            {message ?? ""}
          </Text>
          {maxCount ? (
            <Text style={fieldStyles.counter}>{`${value?.length ?? 0} / ${maxCount}`}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
