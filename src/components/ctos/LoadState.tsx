import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import useAsciiSpinner from "@/hooks/useAsciiSpinner";
import { spacing, text, tone } from "@/style/globalStyles";
import Button from "./Button";

type Props = {
  loading?: boolean;
  error?: string | null;
  /** neutral message (no ✕) shown when there is nothing to load and no error */
  notice?: string;
  onRetry?: () => void;
  loadingLabel?: string;
  /** shown when neither loading nor error */
  children?: ReactNode;
};

// loading spinner / error + RETRY / content, in one place
export default function LoadState({ loading, error, notice, onRetry, loadingLabel = "LOADING", children }: Props) {
  const spin = useAsciiSpinner(!!loading);
  if (loading)
    return (
      <View style={styles.center}>
        <Text style={text.caption}>{`${spin} ${loadingLabel}`}</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.center}>
        <Text style={[text.caption, { color: tone.err.color }]}>{`${tone.err.glyph} ${error}`}</Text>
        {onRetry ? <Button label="Retry" variant="secondary" size="sm" onPress={onRetry} /> : null}
      </View>
    );
  if (notice && !children)
    return (
      <View style={styles.center}>
        <Text style={text.caption}>{notice}</Text>
        {onRetry ? <Button label="Retry" variant="secondary" size="sm" onPress={onRetry} /> : null}
      </View>
    );
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", gap: spacing.md, padding: spacing.xl },
});
