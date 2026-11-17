import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";

import CtosScreen from "@/components/ctos/CtosScreen";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import LoadState from "@/components/ctos/LoadState";
import Tag from "@/components/ctos/Tag";
import CtosText from "@/components/CtosText";

import globalStyles, { text } from "@/style/globalStyles";

import ReleasesPanel from "@/features/devfeed/components/ReleasesPanel";
import StoryRow from "@/features/devfeed/components/StoryRow";
import { useStories } from "@/features/devfeed/hooks";
import { SOURCE_LABEL } from "@/features/devfeed/utils";
import { APP_TAG } from "@/global/appInfo";
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
      <View style={globalStyles.header}>
         <Text style={globalStyles.sectionLabel}>{`${APP_TAG}DEV_FEED`}</Text>

        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}>Signal</CtosText>
          <Tag
            label={error ? "OFFLINE" : `SYNC ${synced}`}
            color={error ? Colors.warning : Colors.primary}
          />
        </View>
      </View>

      <View style={styles.chips}>
        <ChipRow>
          {SOURCES.map((s) => (
            <Chip key={s} label={SOURCE_LABEL[s]} selected={source === s} onPress={() => setSource(s)} />
          ))}
        </ChipRow>
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
          <LoadState loading={loading} error={error} notice="NOTHING TO SHOW" onRetry={refetch} />
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

const styles = StyleSheet.create({
  chips: { paddingHorizontal: 16, paddingVertical: 12 },
});
