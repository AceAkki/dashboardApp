import { Pressable, Text, View } from "react-native";

import { openLink } from "@/features/favLinks/utils/openLink";
import { Colors } from "@/constants/Colors";
import type { Story } from "../devTypes";
import { SOURCE_LABEL, timeAgo } from "../utils";
import styles from "./devFeedStyles";

type Props = { story: Story };

// Feed screen card. Tap = open the link, long press = open the discussion.
export default function StoryRow({ story }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.story, pressed && { borderColor: Colors.primary }]}
      onPress={() => openLink(story.url, story.title)}
      onLongPress={() => openLink(story.discussionUrl, story.title)}
      accessibilityLabel={`${story.title}, ${story.points} points, ${story.comments} comments`}
    >
      <View style={styles.storyScore}>
        <Text style={styles.storyScoreNum}>{story.points}</Text>
        <Text style={styles.storyMeta}>PTS</Text>
      </View>
      <View style={styles.storyBody}>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.storyMeta}>
          {story.comments} COMMENTS · {timeAgo(story.time)} ·{" "}
          <Text style={styles.storySource}>{SOURCE_LABEL[story.source]}</Text>
        </Text>
      </View>
    </Pressable>
  );
}
