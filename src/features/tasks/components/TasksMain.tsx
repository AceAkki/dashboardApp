import { ScrollView, Text, View } from "react-native";

import Task from "./Task";
import type { TasksMainProps } from "../taskTypes";
import tasksMainStyles from "./tasksMainStyles";

// ScrollView (not FlatList) so it can sit inside the dashboard's ScrollView
// without the "VirtualizedLists nested in ScrollView" warning.
const TasksMain = ({ taskData, Type }: TasksMainProps) => {
  if (!Array.isArray(taskData)) return null;

  const filterTasks =
    Type === "All"
      ? taskData
      : taskData.filter((task) => task.type[Type as keyof typeof task.type]);

  return (
    <View style={tasksMainStyles.tasksMainWrap}>
      <Text style={tasksMainStyles.tasksMainTitle}>{Type} Tasks</Text>
      <ScrollView nestedScrollEnabled>
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
