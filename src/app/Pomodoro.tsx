import { Text, View } from "react-native";
import CtosScreen from "@/components/ctos/CtosScreen";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import IconButton from "@/components/ctos/IconButton";

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
    <CtosScreen style={pomodoroStyles.screen}  edges={["top", "bottom"]}>
      <View style={pomodoroStyles.modeTabs}>
        <ChipRow center>
          {MODES.map((m) => (
            <Chip key={m} label={MODE_LABEL[m]} selected={mode === m} onPress={() => setMode(m)} />
          ))}
        </ChipRow>
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
        <IconButton variant="plain" icon="refresh" label="Reset" onPress={reset} />
        <IconButton
          variant="primary"
          size={76}
          icon={running ? "pause" : "play"}
          label={running ? "Pause" : "Start"}
          onPress={running ? pause : start}
        />
        <IconButton variant="plain" icon="play-skip-forward" label="Skip" onPress={skip} />
      </View>
    </CtosScreen>
  );
}
