import { Pressable, ScrollView, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import { useTaskStore } from "../tasks/hooks/useTasksStore";
import { useUserStore } from "../auth/useAuthStore";
import {
  timeOfTheDayGreeting,
  useOnlineStatus,
} from "../../global/globalFunctions";
import TaskSummary from "../tasks/components/TaskSummary";
import PomodoroCard from "../pomodoro/components/PomodoroCard";
import WeatherCardContainer from "../weather/components/WeatherCardContainer";
import GitStats from "../gitStats/GitStats";
import ServiceStatusPanel from "../devfeed/components/ServiceStatusPanel";
import StoriesPanel from "../devfeed/components/StoriesPanel";
import PackageWatchPanel from "../devfeed/components/PackageWatchPanel";
import { isoWeek } from "../devfeed/utils";
import Panel from "@/components/ctos/Panel";
import Tag from "@/components/ctos/Tag";
import CtosText from "@/components/CtosText";
import CtosItem from "@/components/CtosItem";

import TerminalPanel from "@/features/tools/components/TerminalPanel";
import bentoStyles from "./bentoStyles";

const BentoStructure = () => {
  const router = useRouter();
  const online = useOnlineStatus();
  const { username, location } = useUserStore(
    useShallow((s) => ({ username: s.username, location: s.location })),
  );

  const now = new Date();
  const dateLabel = `${now.toLocaleDateString("en", { weekday: "short" }).toUpperCase()} ${String(
    now.getDate(),
  ).padStart(
    2,
    "0",
  )} ${now.toLocaleDateString("en", { month: "short" }).toUpperCase()} · WK ${isoWeek(now)}`;

  return (
    <View style={bentoStyles.root}>
      <ScrollView
        contentContainerStyle={bentoStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={bentoStyles.headerRow}>
          <CtosText
            style={globalStyles.sectionLabel}
          >{`// ${dateLabel}`}</CtosText>
          <View style={bentoStyles.headerRight}>
            <Tag
              label={online ? "ONLINE" : "OFFLINE"}
              color={online ? Colors.success : Colors.warning}
            />
            <Pressable
              onPress={() => router.push("/UserProfile")}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
            >
              <View style={bentoStyles.avatar}>
                <Text style={bentoStyles.avatarTxt}>
                  {username.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={bentoStyles.greetWrap}>
          <Text style={bentoStyles.greet}>
            <CtosText>{timeOfTheDayGreeting()}</CtosText>{" "}
            <CtosText>{username}!</CtosText>
          </Text>
          <Text style={bentoStyles.synced}>
            LAT {location.latitude.toFixed(2)} · LON{" "}
            {location.longitude.toFixed(2)}
          </Text>
        </View>

        <CtosItem index={0}>
          <TerminalPanel />
        </CtosItem>

        <CtosItem index={1}>
          <TaskSummary />
        </CtosItem>

        <CtosItem index={2}>
          <View style={bentoStyles.row}>
            <WeatherCardContainer />
            <GitStats />
          </View>
        </CtosItem>

        <CtosItem index={3}>
          <ServiceStatusPanel />
        </CtosItem>

        <CtosItem index={4}>
          <StoriesPanel />
        </CtosItem>

        <CtosItem index={5}>
          <PackageWatchPanel />
        </CtosItem>

        <CtosItem index={6}>
          <View style={bentoStyles.row}>
            <PomodoroCard />
          </View>
        </CtosItem>
      </ScrollView>
    </View>
  );
};

export default BentoStructure;
