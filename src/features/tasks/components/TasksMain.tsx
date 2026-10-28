import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import Task from "./Task";
import { TABS } from "../taskTypeUtils";
import type { TasksMainProps } from "../taskTypes";
import tasksMainStyles from "./tasksMainStyles";

// ScrollView (not FlatList) so it can sit inside the dashboard's ScrollView
// without the "VirtualizedLists nested in ScrollView" warning.
const TasksMain = ({ taskData, Type }: TasksMainProps) => {
  const { height } = useWindowDimensions();

  if (!Array.isArray(taskData)) return null;

  const filterTasks =
    Type === TABS[0]
      ? taskData
      : taskData.filter((task) => task.type[Type as keyof typeof task.type]);

  return (
    <View
      style={[tasksMainStyles.tasksMainWrap, { height: height - height / 3 }]}
    >
      <Text style={tasksMainStyles.tasksMainTitle}>{Type} tasks</Text>
      <ScrollView nestedScrollEnabled style={{ height: height }}>
        {filterTasks.length === 0 ? (
          <Text style={tasksMainStyles.empty}>No tasks yet</Text>
        ) : (
          filterTasks.map((task) => <Task key={task.id} taskTxt={task} />)
        )}
      </ScrollView>
    </View>
  );
};

export default TasksMain;
