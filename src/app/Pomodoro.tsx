import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import TimerRing from "@/features/pomodoro/components/TimerRing";
import usePomodoro from "@/features/pomodoro/hooks/usePomodoro";
import { modeColor } from "@/features/pomodoro/modeColor";
import {
  MODE_LABEL,
  SESSIONS_BEFORE_LONG,
  type PomodoroMode,
} from "@/features/pomodoro/hooks/pomodoroStore";
import pomodoroStyles from "@/features/pomodoro/pomodoroStyles";
import CtosText from "@/components/CtosText";

const MODES: PomodoroMode[] = ["focus", "short", "long"];

export default function PomodoroScreen() {
  const {
    mode,
    label,
    progress,
    running,
    completedSessions,
    start,
    pause,
    reset,
    skip,
    setMode,
  } = usePomodoro();

  // dots show progress toward the next long break
  const doneInCycle = completedSessions % SESSIONS_BEFORE_LONG;

  return (
    <SafeAreaView style={pomodoroStyles.screen} edges={["bottom"]}>
      <View style={pomodoroStyles.modeTabs}>
        {MODES.map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[
              pomodoroStyles.modeTab,
              mode === m && pomodoroStyles.modeTabActive,
            ]}
          >
            <Text
              style={[
                pomodoroStyles.modeTabTxt,
                mode === m && pomodoroStyles.modeTabTxtActive,
              ]}
            >
              {MODE_LABEL[m]}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={pomodoroStyles.ringWrap}>
        <TimerRing
          size={280}
          strokeWidth={14}
          progress={progress}
          color={modeColor(mode)}
        >
          <Text style={pomodoroStyles.bigTime}>{label}</Text>
          <CtosText style={pomodoroStyles.bigMode}>{MODE_LABEL[mode]}</CtosText>
        </TimerRing>
      </View>

      <View style={pomodoroStyles.sessionRow}>
        {Array.from({ length: SESSIONS_BEFORE_LONG }).map((_, i) => (
          <View
            key={i}
            style={[
              pomodoroStyles.sessionDot,
              i < doneInCycle && pomodoroStyles.sessionDotDone,
            ]}
          />
        ))}
      </View>
      <CtosText style={pomodoroStyles.sessionTxt}>
        {completedSessions} sessions completed
      </CtosText>

      <View style={pomodoroStyles.bigControls}>
        <Pressable onPress={reset}>
          <Ionicons name="refresh" size={26} color={Colors.textSecondary} />
        </Pressable>
        <Pressable
          style={pomodoroStyles.bigPlayBtn}
          onPress={running ? pause : start}
        >
          <Ionicons
            name={running ? "pause" : "play"}
            size={34}
            color={Colors.textOnPrimary}
          />
        </Pressable>
        <Pressable onPress={skip}>
          <Ionicons
            name="play-skip-forward"
            size={26}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
