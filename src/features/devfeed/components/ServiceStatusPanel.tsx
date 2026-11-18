import { Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import Spinner from "@/components/ctos/Spinner";
import Status from "@/components/ctos/Status";
import Hint from "@/components/ctos/Hint";
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
      style={{ flex: 1 }}
      right={
        data ? (
          <Tag
            label={allOk ? "STABLE" : "ALERT"}
            color={allOk ? Colors.success : Colors.warning}
          />
        ) : loading ? (
          <Spinner />
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
      {error ? <Status tone="warn">{error}</Status> : null}
      {!data && !loading && !error ? (
        <Hint>NO DATA</Hint>
      ) : null}
    </Panel>
  );
}
