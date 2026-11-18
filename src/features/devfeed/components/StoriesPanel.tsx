import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import Panel from "@/components/ctos/Panel";
import Spinner from "@/components/ctos/Spinner";
import Status from "@/components/ctos/Status";
import { openLink } from "@/features/favLinks/utils/openLink";
import { useStories } from "../hooks";
import { timeAgo } from "../utils";
import styles from "./devFeedStyles";

// Dashboard card: the top three Hacker News stories. Header opens the Feed.
export default function StoriesPanel() {
  const router = useRouter();
  const { data, loading, error } = useStories("hn");

  return (
    <Panel
      title="TOP ON HACKER NEWS"
      onPress={() => router.replace("/Feed")}

      right={
        loading && !data ? (
          <Spinner />
        ) : (
          <Text style={styles.lineValue}>FEED ›</Text>
        )
      }
    >
      {(data ?? []).slice(0, 3).map((s, i) => (
        <Pressable
          key={s.id}
          style={[styles.line, i === 0 && styles.lineFirst]}
          onPress={() => openLink(s.url, s.title)}
        >
          <Text style={styles.points}>{s.points}▲</Text>
          <Text style={styles.lineName} numberOfLines={1}>
            {s.title}
          </Text>
          <Text style={styles.lineValue}>{timeAgo(s.time)}</Text>
        </Pressable>
      ))}
      {error ? <Status tone="warn">{error}</Status> : null}
    </Panel>
  );
}
