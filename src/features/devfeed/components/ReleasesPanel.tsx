import { ActivityIndicator, Pressable, Text } from "react-native";

import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import { openLink } from "@/features/favLinks/utils/openLink";
import { useReleases } from "../hooks";
import { timeAgo } from "../utils";
import styles from "./devFeedStyles";

export default function ReleasesPanel() {
  const { data, loading, error } = useReleases();

  return (
    <Panel
      title="RELEASES · PUBLIC REPOS"
      right={loading && !data ? <ActivityIndicator size="small" color={Colors.primary} /> : null}
    >
      {(data ?? []).map((r, i) => (
        <Pressable
          key={r.repo}
          style={[styles.line, i === 0 && styles.lineFirst]}
          onPress={() => openLink(r.url, r.repo)}
        >
          <Text style={styles.lineName}>{r.repo}</Text>
          <Text style={[styles.lineValue, { color: Colors.textPrimary }]}>
            {r.tag ?? "--"}
            {r.publishedAt ? ` · ${timeAgo(r.publishedAt)}` : ""}
          </Text>
        </Pressable>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Panel>
  );
}
