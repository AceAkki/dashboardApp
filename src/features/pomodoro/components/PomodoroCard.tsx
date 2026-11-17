import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import TimerRing from "./TimerRing";
import usePomodoro from "../hooks/usePomodoro";
import { MODE_LABEL } from "../hooks/pomodoroStore";
import pomodoroStyles from "../pomodoroStyles";
import { modeColor } from "../modeColor";
import CtosText from "@/components/CtosText";
import IconButton from "@/components/ctos/IconButton";
import Corners from "@/components/ctos/Corners";

// Compact dashboard version;
export default function PomodoroCard() {
  const router = useRouter();
  const { mode, label, progress, running, start, pause, reset, skip } =
    usePomodoro();

  return (
    <View style={[pomodoroStyles.card, { flex: 1 }]}>
      <Pressable
        style={pomodoroStyles.cardHead}
        onPress={() => router.push("/Pomodoro")}
      >
        <CtosText style={pomodoroStyles.cardTitle}>
          {"// Pomodoro Timer"}
        </CtosText>
        <Ionicons
          name="expand-outline"
          size={14}
          color={Colors.textSecondary}
        />
      </Pressable>

      <View style={pomodoroStyles.cardRingWrap}>
        <TimerRing
          size={112}
          strokeWidth={7}
          progress={progress}
          color={modeColor(mode)}
        >
          <Text style={pomodoroStyles.cardTime}>{label}</Text>
          <Text style={pomodoroStyles.cardMode}>{MODE_LABEL[mode]}</Text>
        </TimerRing>
      </View>

      <View style={pomodoroStyles.controls}>
        <IconButton variant="plain" icon="refresh" label="Reset" onPress={reset} />
        <IconButton
          icon={running ? "pause" : "play"}
          label={running ? "Pause" : "Start"}
          size={40}
          onPress={running ? pause : start}
        />
        <IconButton variant="plain" icon="play-skip-forward" label="Skip" onPress={skip} />
      </View>
      <Corners />
    </View>
  );
}
