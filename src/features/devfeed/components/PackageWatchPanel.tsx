import { Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import Spinner from "@/components/ctos/Spinner";
import Status from "@/components/ctos/Status";
import Hint from "@/components/ctos/Hint";
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
      style={{ flex: 1 }}
      right={
        loading && rows.length === 0 ? (
          <Spinner />
        ) : anyNew ? (
          <Tag label="Latest" color={Colors.success} />
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
      {error ? <Status tone="warn">{error}</Status> : null}
      {anyNew ? <Hint>TAP TO MARK AS SEEN</Hint> : null}
    </Panel>
  );
}
