import { ScrollView, Text, View } from "react-native";

import Corners from "@/components/ctos/Corners";
import Task from "./Task";
import { ALL_TAB } from "../taskTypeUtils";
import type { TasksMainProps } from "../taskTypes";
import tasksMainStyles from "./tasksMainStyles";

// ScrollView (not FlatList) so it can sit inside the dashboard's ScrollView
// without the "VirtualizedLists nested in ScrollView" warning.
const TasksMain = ({ taskData, Type }: TasksMainProps) => {
  if (!Array.isArray(taskData)) return null;

  const isAll = Type === ALL_TAB;
  const filterTasks = isAll
    ? taskData
    : taskData.filter((task) => task.type[Type as keyof typeof task.type]);

  return (
    <View style={tasksMainStyles.tasksMainWrap}>
      <Text style={tasksMainStyles.tasksMainTitle}>
        {`// ${isAll ? "ALL" : Type} · ${String(filterTasks.length).padStart(2, "0")}`}
      </Text>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {filterTasks.length === 0 ? (
          <Text style={tasksMainStyles.empty}>
            {"// END OF QUEUE\nNO TASKS HERE"}
          </Text>
        ) : (
          filterTasks.map((task) => (
            <Task key={task.id} taskTxt={task} showType={isAll} />
          ))
        )}
      </ScrollView>
      <Corners />
    </View>
  );
};

export default TasksMain;
