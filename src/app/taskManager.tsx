import { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";
import { TabBar, TabView, SceneRendererProps } from "react-native-tab-view";

import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import taskManagerStyles from "@/features/tasks/components/taskManagerStyles";
import OptionsPopup from "@/features/tasks/components/OptionsPopup";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import useTaskMain from "@/features/tasks/hooks/useTaskMain";
import TaskForm from "@/features/tasks/components/TaskForm";
import TasksMain from "@/features/tasks/components/TasksMain";
import EditTaskForm from "@/features/tasks/components/EditTaskForm";
// import { Tabs } from "react-native-screens";

import type { RouteType, TaskActionData } from "@/features/tasks/taskTypes";
import { TABS } from "@/features/tasks/taskTypeUtils";

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

  const renderScene = ({
    route,
  }: SceneRendererProps & { route: RouteType }) => {
    return (
      <View style={taskManagerStyles.container}>
        <View>
          <TasksMain taskData={tasks} Type={route.key} />
        </View>
      </View>
    );
  };

  // Popup position is derived from the press, so it lives with the Task
  const isOpen = taskID && !isEditMode;
  const editingTask = isEditMode ? tasks.find((t) => t.id === taskID) : null;
  const taskTxt = tasks.find((task) => task?.id === taskID) as TaskActionData;

  return (
    <SafeAreaView style={globalStyles.screen}>
      <View style={taskManagerStyles.container}>
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
        commonOptions={{
          labelStyle: taskManagerStyles.tab,
        }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={[
              taskManagerStyles.tabs,
              {
                backgroundColor: "transparent",
              },
            ]}
            indicatorStyle={{ backgroundColor: "none" }}
            activeColor={Colors.primary}
            inactiveColor={Colors.textPrimary}
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
    </SafeAreaView>
  );
}
