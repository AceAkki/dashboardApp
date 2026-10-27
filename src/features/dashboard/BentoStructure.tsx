import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShallow } from "zustand/shallow";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { useTaskStore } from "../tasks/hooks/useTasksStore";
import { useUserStore } from "../auth/useAuthStore";
import { timeOfTheDayGreeting } from "../../global/globalFunctions";
import PomodoroCard from "../pomodoro/components/PomodoroCard";
import bentoStyles from "./bentoStyles";
import WeatherCardContainer from "../weather/components/WeatherCardContainer";
import FavLinks from "../favLinks/FavLinks";
import CtosText from "@/components/CtosText";
import GitStats from "../gitStats/GitStats";
import globalStyles from "@/style/globalStyles";

// stagger-in, replaces motion's container/item variants
function FadeInItem({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      delay: 300 + index * 150,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);
  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

const CardHead = ({
  title,
  icon = "ellipsis-vertical",
}: {
  title: string;
  icon?: "ellipsis-vertical" | "close";
}) => (
  <View style={bentoStyles.cardHead}>
    <Text style={bentoStyles.cardTitle}>{title}</Text>
    <Ionicons name={icon} size={14} color={Colors.textSecondary} />
  </View>
);

function NotesCard() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const save = () => {
    // TODO: wire to your notes store
    if (!title.trim() && !body.trim()) return;
    setTitle("");
    setBody("");
  };
  return (
    <View style={bentoStyles.card}>
      <CardHead title="NotesForm" icon="close" />
      <Text style={bentoStyles.noteLabel}>Title</Text>
      <TextInput
        style={bentoStyles.noteInput}
        placeholder="Example text here"
        placeholderTextColor={Colors.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[bentoStyles.noteInput, bentoStyles.noteBody]}
        placeholder="Quick Note..."
        placeholderTextColor={Colors.textMuted}
        value={body}
        onChangeText={setBody}
        multiline
      />
      <Pressable style={bentoStyles.saveBtn} onPress={save}>
        <Text style={bentoStyles.saveTxt}>Save</Text>
      </Pressable>
    </View>
  );
}

const BentoStructure = () => {
  const router = useRouter();
  const tasks = useTaskStore((state) => state.tasks);
  const { username, location } = useUserStore(
    useShallow((s) => ({ username: s.username, location: s.location })),
  );

  const priority = tasks.filter((t) => t.type.Priority).length;
  const current = tasks.filter((t) => t.type.Current).length;
  const completed = tasks.filter((t) => t.type.Completed).length;
  const maxCount = Math.max(priority, current, completed, 1);
  const barH = (n: number) => 8 + (n / maxCount) * 48;

  return (
    <View style={bentoStyles.root}>
      <ScrollView contentContainerStyle={bentoStyles.scroll}>
        <View style={bentoStyles.headerRow}>
          <View style={bentoStyles.locationPill}>
            <Ionicons
              name="location-outline"
              size={14}
              color={Colors.textPrimary}
            />
            <CtosText style={bentoStyles.locationTxt}>
              {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
            </CtosText>
          </View>
          <View style={bentoStyles.headerRight}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.textPrimary}
            />
            <View style={bentoStyles.avatar}>
              <Text style={bentoStyles.avatarTxt}>
                {username.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          </View>
        </View>

        <View style={bentoStyles.greetWrap}>
          <Text style={bentoStyles.greet}>
            <CtosText>{timeOfTheDayGreeting()}</CtosText>{" "}
            <CtosText>{username}!</CtosText>{" "}
            <Text style={bentoStyles.greetSub}></Text>
          </Text>

          <Text style={bentoStyles.synced}>
            <Text style={bentoStyles.syncedDot}> ● </Text>Synced · Last Update:
            just now
          </Text>
        </View>

        <FadeInItem index={0}>
          <View style={bentoStyles.card}>
            <View style={bentoStyles.focusRow}>
              <View style={bentoStyles.focusTxtWrap}>
                <View>
                  <CtosText style={bentoStyles.focusLabel}>
                    Priority Tasks
                  </CtosText>
                  <Text style={[bentoStyles.small, { color: Colors.danger }]}>
                    {priority}
                    <CtosText> Priority</CtosText>
                  </Text>
                </View>
                <View>
                  <CtosText style={bentoStyles.focusLabel}>
                    Current Tasks
                  </CtosText>
                  <Text style={bentoStyles.small}>
                    <Text style={{ color: Colors.primary }}>
                      {current} in Progress
                    </Text>
                    {", "}
                    <Text style={{ color: Colors.success }}>
                      {completed} Completed
                    </Text>
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => router.push("/taskManager")} style={bentoStyles.focusRow}>
                <View style={bentoStyles.barChart}>
                  <View
                    style={[
                      bentoStyles.bar,
                      {
                        height: barH(priority),
                        backgroundColor: Colors.danger,
                      },
                    ]}
                  />
                  <View
                    style={[
                      bentoStyles.bar,
                      {
                        height: barH(current),
                        backgroundColor: Colors.primary,
                      },
                    ]}
                  />
                  <View
                    style={[
                      bentoStyles.bar,
                      {
                        height: barH(completed),
                        backgroundColor: Colors.success,
                      },
                    ]}
                  />
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </FadeInItem>

        <FadeInItem index={1}>
          <View>
            <FavLinks />
          </View>
          <View></View>
        </FadeInItem>

        <FadeInItem index={2}>
          <View style={bentoStyles.row}>
            <WeatherCardContainer />

            <GitStats />

            {/* <View style={bentoStyles.card}>
              <CardHead title="FavLinks" />
              {["Figma", "Github", "Notion", "Canva"].map((l) => (
                <View key={l} style={bentoStyles.linkItem}>
                  <Ionicons
                    name="link-outline"
                    size={12}
                    color={Colors.primary}
                  />
                  <Text style={bentoStyles.linkTxt}>{l}</Text>
                </View>
              ))}
            </View> */}
          </View>
        </FadeInItem>

        <FadeInItem index={3}>
          <View style={bentoStyles.row}>
            <PomodoroCard />
            <NotesCard />
          </View>
        </FadeInItem>

        <FadeInItem index={4}>
          <View style={bentoStyles.row}>
            <View style={bentoStyles.card}>
              <CardHead title="RenderNews" />
              {["Local info", "Tech headlines", "Tech headlines"].map(
                (n, i) => (
                  <View key={i} style={bentoStyles.newsItem}>
                    <Text style={bentoStyles.newsTitle}>{n}</Text>
                    <Text style={bentoStyles.newsSub} numberOfLines={1}>
                      Connect your news feed
                    </Text>
                  </View>
                ),
              )}
            </View>
            <View style={bentoStyles.card}>
              <CardHead title="LinkStorage" />
              {["Project Title", "Project Title"].map((t, i) => (
                <View key={i} style={bentoStyles.linkTile}>
                  <Text style={bentoStyles.small}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </FadeInItem>
      </ScrollView>
    </View>
  );
};

export default BentoStructure;
