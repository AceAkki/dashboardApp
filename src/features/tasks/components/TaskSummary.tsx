import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import Panel from "@/components/ctos/Panel";
import { useTaskStore } from "../hooks/useTasksStore";
import { countTasks, taskMain, taskTypesArr } from "../taskTypeUtils";

import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import bentoStyles from "@/features/dashboard/bentoStyles";

// counts per task type, big readouts with a proportional bar underneath
export default function TaskSummary() {
  const router = useRouter();
  const tasks = useTaskStore((state) => state.tasks);

  const counts = countTasks(tasks);

  return (
    <Panel
      title="TASK QUEUE"
      onPress={() => router.replace("/TaskManager")}
      right={<Text style={bentoStyles.small}>OPEN ›</Text>}
    >
      <View style={bentoStyles.counts}>
        {taskTypesArr.map((k) => (
          <View key={k} style={bentoStyles.countCell}>
            <Text style={[globalStyles.textReadout, { color: taskMain[k].taskColor }]}>
              {String(counts[k]).padStart(2, "0")}
            </Text>
            <Text style={bentoStyles.countLabel}>
              {taskMain[k].taskGlyph} {k}
            </Text>
          </View>
        ))}
      </View>
      <View style={bentoStyles.segBar}>
        {tasks.length === 0 ? (
          <View style={{ flex: 1, backgroundColor: Colors.border }} />
        ) : (
          taskTypesArr
            .filter((k) => counts[k] > 0)
            .map((k) => (
              <View
                key={k}
                style={{
                  flex: counts[k],
                  backgroundColor: taskMain[k].taskColor,
                }}
              />
            ))
        )}
      </View>
    </Panel>
  );
}
