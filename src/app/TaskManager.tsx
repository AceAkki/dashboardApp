import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { useShallow } from "zustand/shallow";
import { TabView, SceneRendererProps } from "react-native-tab-view";

import CtosScreen from "@/components/ctos/CtosScreen";
import Tag from "@/components/ctos/Tag";
import CtosText from "@/components/CtosText";

import globalStyles from "@/style/globalStyles";
import taskManagerStyles from "@/features/tasks/components/taskManagerStyles";
import OptionsPopup from "@/features/tasks/components/OptionsPopup";
import TaskForm from "@/features/tasks/components/TaskForm";
import TaskTabs from "@/features/tasks/components/TaskTabs";
import TasksMain from "@/features/tasks/components/TasksMain";
import EditTaskForm from "@/features/tasks/components/EditTaskForm";

import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import useTaskMain from "@/features/tasks/hooks/useTaskMain";
import {
  ALL_TAB,
  TABS,
  countTasks,
  openCount,
} from "@/features/tasks/taskTypeUtils";

import type { RouteType, TaskActionData } from "@/features/tasks/taskTypes";

const routes = TABS.map((tab) => {
  return { key: tab, title: tab };
});

export default function TaskManager() {
  const { tasks, updateTasks, isEditMode, taskID, setTaskID, taskPosition } =
    useTaskStore(
      useShallow((state) => ({
        tasks: state.tasks,
        updateTasks: state.updateTasks,
        isEditMode: state.isEditMode,
        taskID: state.taskID,
        setTaskID: state.setTaskID,
        taskPosition: state.taskPosition,
      })),
    );
  const { taskInput, setTaskInput, submitTask } = useTaskMain(updateTasks);
  const [index, setIndex] = useState(0);

  const layout = useWindowDimensions();

  const kindCounts = countTasks(tasks);
  const counts: Record<string, number> = {
    [ALL_TAB]: tasks.length,
    ...kindCounts,
  };
  const open = openCount(kindCounts);

  const renderScene = ({
    route,
  }: SceneRendererProps & { route: RouteType }) => {
    return (
      <View style={taskManagerStyles.scene}>
        <TasksMain taskData={tasks} Type={route.key} />
      </View>
    );
  };

  // one popup / edit form for the whole screen, driven by the store
  const isOpen = taskID && !isEditMode;
  const editingTask = isEditMode ? tasks.find((t) => t.id === taskID) : null;
  const taskTxt = tasks.find((task) => task?.id === taskID) as TaskActionData;

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>
          {"// CTOS · TASK_MANAGER"}
        </Text>
        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}>Task Queue</CtosText>
          <Tag label={`${String(open).padStart(2, "0")} OPEN`} />
        </View>
        <TaskForm
          value={taskInput}
          onChangeText={setTaskInput}
          onSubmit={submitTask}
        />
      </View>

      <TabView
        navigationState={{ index, routes }}
        lazy
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TaskTabs
            routes={routes}
            index={props.navigationState.index}
            onChange={(i) => props.jumpTo(routes[i].key)}
            counts={counts}
          />
        )}
      />

      {editingTask && (
        <EditTaskForm key={editingTask.id} taskObject={editingTask} />
      )}
      {isOpen && (
        <OptionsPopup
          taskObject={taskTxt}
          position={taskPosition as { x: number; y: number }}
          onClose={() => setTaskID(null)}
        />
      )}
    </CtosScreen>
  );
}
