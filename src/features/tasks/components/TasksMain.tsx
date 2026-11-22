import { ScrollView, Text, View } from "react-native";

import Corners from "@/components/ctos/Corners";
import Task from "./Task";
import { ALL_TAB, isFinished } from "../taskTypeUtils";
import { matchTasks } from "../taskTags";
import type { TasksMainProps } from "../taskTypes";
import tasksMainStyles from "./tasksMainStyles";

// ScrollView (not FlatList) so it can sit inside the dashboard's ScrollView
// without the "VirtualizedLists nested in ScrollView" warning.
const pad = (n: number) => String(n).padStart(2, "0");

const TasksMain = ({ taskData, Type, tag = null, query = "" }: TasksMainProps) => {
  if (!Array.isArray(taskData)) return null;

  const isAll = Type === ALL_TAB;
  const inTab = isAll
    ? taskData
    : taskData.filter((task) => task.type[Type as keyof typeof task.type]);
  // the tab, the tag chip and the search all apply together
  const filterTasks = matchTasks(inTab, tag, query);
  const filtering = !!tag || !!query.trim();

  return (
    <View style={tasksMainStyles.tasksMainWrap}>
      <Text style={tasksMainStyles.tasksMainTitle}>
        {`// ${isAll ? "ALL" : Type} · ${pad(filterTasks.length)}${filtering ? ` OF ${pad(inTab.length)}` : ""}`}
      </Text>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 72 }}
      >
        {filterTasks.length === 0 ? (
          <Text style={tasksMainStyles.empty}>
            {filtering
              ? "// NO MATCHES\nTRY ANOTHER SEARCH OR TAG"
              : "// END OF QUEUE\nNO TASKS HERE"}
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
