import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";

import globalStyles from "@/style/globalStyles";
import taskManagerStyles from "@/features/tasks/components/taskManagerStyles";

import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import useTaskMain from "@/features/tasks/hooks/useTaskMain";
import TaskForm from "@/features/tasks/components/TaskForm";
import TasksMain from "@/features/tasks/components/TasksMain";
import EditTaskForm from "@/features/tasks/components/EditTaskForm";

const TABS = ["All", "Current", "Priority", "Completed"] as const;

export default function TaskManager() {
  const { tasks, updateTasks, isEditMode, taskID } = useTaskStore(
    useShallow((state) => ({
      tasks: state.tasks,
      updateTasks: state.updateTasks,
      isEditMode: state.isEditMode,
      taskID: state.taskID,
    })),
  );
  const { taskInput, setTaskInput, submitTask } = useTaskMain(updateTasks);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  const editingTask = isEditMode ? tasks.find((t) => t.id === taskID) : null;

  return (
    <SafeAreaView style={globalStyles.containerFull}>
      <View style={taskManagerStyles.container}>
        <TaskForm
          value={taskInput}
          onChangeText={setTaskInput}
          onSubmit={submitTask}
        />

        <View style={taskManagerStyles.tabs}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                taskManagerStyles.tab,
                activeTab === tab && taskManagerStyles.tabActive,
              ]}
            >
              <Text
                style={[
                  taskManagerStyles.tabTxt,
                  activeTab === tab && taskManagerStyles.tabTxtActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={taskManagerStyles.tasksGridWrap}>
          <TasksMain taskData={tasks} Type={activeTab} />
        </View>
      </View>

      {editingTask && (
        <EditTaskForm key={editingTask.id} taskObject={editingTask} />
      )}
    </SafeAreaView>
  );
}
