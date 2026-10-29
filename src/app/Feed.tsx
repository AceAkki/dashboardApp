import { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";

import CtosScreen from "@/components/ctos/CtosScreen";
import Tag from "@/components/ctos/Tag";
import CtosText from "@/components/CtosText";

import globalStyles, { text } from "@/style/globalStyles";

import ReleasesPanel from "@/features/devfeed/components/ReleasesPanel";
import StoryRow from "@/features/devfeed/components/StoryRow";
import styles from "@/features/devfeed/components/devFeedStyles";
import { useStories } from "@/features/devfeed/hooks";
import { SOURCE_LABEL } from "@/features/devfeed/utils";

import type { StorySource } from "@/features/devfeed/devTypes";

const SOURCES: StorySource[] = ["hn", "dev", "lobsters"];

export default function Feed() {
  const [source, setSource] = useState<StorySource>("hn");
  const { data, loading, error, updatedAt, refetch } = useStories(source);

  const synced = updatedAt
    ? new Date(updatedAt).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";

  return (
    <CtosScreen nav>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Text style={globalStyles.sectionLabel}>{"// DEV FEED"}</Text>
        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}>Signal</CtosText>
          <Tag
            label={error ? "OFFLINE" : `SYNC ${synced}`}
            color={error ? Colors.warning : Colors.primary}
          />
        </View>
      </View>

      <View style={styles.chips}>
        {SOURCES.map((s) => (
          <Pressable
            key={s}
            style={[globalStyles.chip, source === s && globalStyles.chipActive]}
            onPress={() => setSource(s)}
            accessibilityRole="button"
            accessibilityState={{ selected: source === s }}
          >
            <Text
              style={[text.small, source === s && { color: Colors.primary }]}
            >
              {SOURCE_LABEL[s]}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(s) => `${s.source}-${s.id}`}
        renderItem={({ item }) => <StoryRow story={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={loading && !!data}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <Text
            style={[
              globalStyles.textMuted,
              { textAlign: "center", marginVertical: 24 },
            ]}
          >
            {loading ? "LOADING FEED…" : (error ?? "NOTHING TO SHOW")}
          </Text>
        }
        ListFooterComponent={
          <View style={{ marginTop: 8 }}>
            <ReleasesPanel />
            <Text
              style={[
                text.caption,
                { textAlign: "center", marginTop: 12, color: Colors.textMuted },
              ]}
            >
              TAP: OPEN LINK · HOLD: OPEN DISCUSSION
            </Text>
          </View>
        }
      />
    </CtosScreen>
  );
}
