import { ActivityIndicator, Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import Tag from "@/components/ctos/Tag";
import { Colors } from "@/constants/Colors";
import { usePackageWatch } from "../hooks";
import styles from "./devFeedStyles";

// Latest npm versions. A new version shows NEW until the panel is tapped.
export default function PackageWatchPanel() {
  const { rows, loading, error, acknowledge } = usePackageWatch();
  const anyNew = rows.some((r) => r.isNew);

  return (
    <Panel
      title="PACKAGE WATCH"
      onPress={acknowledge}
      right={
        loading && rows.length === 0 ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : anyNew ? (
          <Tag label="UPDATES" color={Colors.success} />
        ) : null
      }
    >
      {rows.map((p, i) => (
        <View key={p.name} style={[styles.line, i === 0 && styles.lineFirst]}>
          <Text style={styles.lineName}>{p.name}</Text>
          {p.isNew ? <Tag label="NEW" color={Colors.success} /> : null}
          <Text style={[styles.lineValue, { color: Colors.textPrimary }]}>
            {p.version ?? "--"}
          </Text>
        </View>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {anyNew ? <Text style={styles.hint}>TAP TO MARK AS SEEN</Text> : null}
    </Panel>
  );
}
