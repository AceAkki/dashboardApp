import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import TimerRing from "./TimerRing";
import usePomodoro from "../hooks/usePomodoro";
import { MODE_LABEL } from "../hooks/pomodoroStore";
import pomodoroStyles from "../pomodoroStyles";
import { modeColor } from "../modeColor";
import IconButton from "@/components/ctos/IconButton";
import Panel from "@/components/ctos/Panel";

// Compact dashboard version;
export default function PomodoroCard() {
  const router = useRouter();
  const { mode, label, progress, running, start, pause, reset, skip } =
    usePomodoro();

  return (
    <Panel
      style={pomodoroStyles.card}
      title="Pomodoro Timer"
      right={
        <IconButton
          variant="plain"
          icon="expand-outline"
          label="Open pomodoro"
          onPress={() => router.push("/Pomodoro")}
        />
      }
    >
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
    </Panel>
  );
}
