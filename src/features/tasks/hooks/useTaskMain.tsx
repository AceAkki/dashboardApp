import { useState } from "react";
import { getTaskTypes } from "../taskTypeUtils";
import type { TaskActionData, TaskActionDataSet } from "../taskTypes";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const useTaskMain = (setTasks: TaskActionDataSet) => {
  const [taskInput, setTaskInput] = useState("");

  const submitTask = () => {
    const name = taskInput.trim();
    if (!name) return;
    const newTask: TaskActionData = {
      id: makeId(),
      taskName: name,
      type: getTaskTypes(),
      remindTime: "",
    };
    setTasks(newTask);
    setTaskInput("");
  };

  return { taskInput, setTaskInput, submitTask };
};

export default useTaskMain;
