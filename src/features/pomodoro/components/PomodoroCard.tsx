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
import Corners from "@/components/ctos/Corners";

// Compact dashboard version;
export default function PomodoroCard() {
  const router = useRouter();
  const { mode, label, progress, running, start, pause, reset, skip } =
    usePomodoro();

  return (
    <View style={pomodoroStyles.card}>
      <Pressable
        style={pomodoroStyles.cardHead}
        onPress={() => router.push("/Pomodoro")}
      >
        <CtosText style={pomodoroStyles.cardTitle}>{"// Pomodoro Timer"}</CtosText>
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
        <Pressable onPress={reset}>
          <Ionicons name="refresh" size={18} color={Colors.textSecondary} />
        </Pressable>
        <Pressable
          style={pomodoroStyles.playBtn}
          onPress={running ? pause : start}
        >
          <Ionicons
            name={running ? "pause" : "play"}
            size={20}
            color={Colors.textPrimary}
          />
        </Pressable>
        <Pressable onPress={skip}>
          <Ionicons
            name="play-skip-forward"
            size={18}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>
      <Corners />
    </View>
  );
}
