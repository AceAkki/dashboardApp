import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";
import { useIsFocused } from "expo-router";
import { useShallow } from "zustand/shallow";
import { TabView, SceneRendererProps } from "react-native-tab-view";

import CtosScreen from "@/components/ctos/CtosScreen";
import Tag from "@/components/ctos/Tag";
import CtosText from "@/components/CtosText";
import CutCornerButton from "@/components/ctos/CutCornerButton";

import globalStyles from "@/style/globalStyles";
import taskManagerStyles from "@/features/tasks/components/taskManagerStyles";
import OptionsPopup from "@/features/tasks/components/OptionsPopup";
import TaskTabs from "@/features/tasks/components/TaskTabs";
import TaskFilters from "@/features/tasks/components/TaskFilters";
import TasksMain from "@/features/tasks/components/TasksMain";
import TaskSheet from "@/features/tasks/components/TaskSheet";
import { APP_TAG } from "@/global/appInfo";

import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import {
  ALL_TAB,
  TABS,
  countTasks,
  openCount,
} from "@/features/tasks/taskTypeUtils";

import { tagCounts } from "@/features/tasks/taskTags";

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
  const [adding, setAdding] = useState(false);
  // the home screen widget's "+ ADD" opens this screen as taskmanager?add=1: show the new-task sheet at once
  const { add } = useLocalSearchParams<{ add?: string }>();
  useEffect(() => {
    if (add === "1") setAdding(true);
  }, [add]);
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const layout = useWindowDimensions();

  const kindCounts = countTasks(tasks);
  const counts: Record<string, number> = {
    [ALL_TAB]: tasks.length,
    ...kindCounts,
  };
  const open = openCount(kindCounts);

  // tag chips cover every tab; a picked tag whose last task went away falls back to "all"
  const tags = tagCounts(tasks);
  const tag = tags.some((t) => t.tag === picked) ? picked : null;

  const renderScene = ({
    route,
  }: SceneRendererProps & { route: RouteType }) => {
    return (
      <View style={taskManagerStyles.scene}>
        <TasksMain
          taskData={tasks}
          Type={route.key}
          tag={tag}
          query={query}
        />
      </View>
    );
  };

  // one popup / edit form for the whole screen, driven by the store
  // the nav bar pushes screens, so an older copy of this page can still be mounted behind:
  // only the page in front may show the sheet and the popup
  const focused = useIsFocused();
  const isOpen = focused && taskID && !isEditMode;
  const editingTask = focused && isEditMode ? tasks.find((t) => t.id === taskID) : null;
  const taskTxt = tasks.find((task) => task?.id === taskID) as TaskActionData;

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
         <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Task_Manager`}</Text>
        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}>Task Queue</CtosText>
          <Tag label={`${String(open).padStart(2, "0")} OPEN`} />
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        lazy
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <View>
            <TaskTabs
              routes={routes}
              index={props.navigationState.index}
              onChange={(i) => props.jumpTo(routes[i].key)}
              counts={counts}
            />
            <TaskFilters
              query={query}
              onQuery={setQuery}
              tags={tags}
              total={tasks.length}
              picked={tag}
              onPick={setPicked}
            />
          </View>
        )}
      />

      <CutCornerButton
        icon="add"
        floating
        accessibilityLabel="Add task"
        onPress={() => setAdding(true)}
      />

      {adding && <TaskSheet onClose={() => setAdding(false)} />}

      {editingTask && (
        <TaskSheet key={editingTask.id} taskObject={editingTask} />
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
