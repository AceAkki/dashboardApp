import { ActivityIndicator, Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import StatusDot from "@/components/ctos/StatusDot";
import Tag from "@/components/ctos/Tag";
import { Colors } from "@/constants/Colors";
import { useServiceStatus } from "../hooks";
import { STATUS_COLOR, STATUS_TEXT } from "../utils";
import styles from "./devFeedStyles";

export default function ServiceStatusPanel() {
  const { data, loading, error, refetch } = useServiceStatus();
  const allOk = !!data && data.every((s) => s.level === "ok");

  return (
    <Panel
      title="SERVICE STATUS"
      onPress={refetch}
      right={
        data ? (
          <Tag label={allOk ? "ALL CLEAR" : "ATTENTION"} color={allOk ? Colors.success : Colors.warning} />
        ) : loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : null
      }
    >
      {(data ?? []).map((s, i) => (
        <View key={s.name} style={[styles.line, i === 0 && styles.lineFirst]}>
          <StatusDot color={STATUS_COLOR[s.level]} />
          <Text style={styles.lineName}>{s.name}</Text>
          <Text style={[styles.lineValue, { color: STATUS_COLOR[s.level] }]}>
            {STATUS_TEXT[s.level]}
          </Text>
        </View>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!data && !loading && !error ? <Text style={styles.hint}>NO DATA</Text> : null}
    </Panel>
  );
}
