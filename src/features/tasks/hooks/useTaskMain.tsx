import { useState } from "react";
import type { TaskActionData, TaskActionDataSet } from "../taskTypes";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Replaces the react-router action flow: there is no <Form method="post">
 * in React Native, so the hook owns the input value and builds the task itself.
 */
const useTaskMain = (setTasks: TaskActionDataSet) => {
  const [taskInput, setTaskInput] = useState("");

  const submitTask = () => {
    const name = taskInput.trim();
    if (!name) return;
    const newTask: TaskActionData = {
      id: makeId(),
      taskName: name,
      type: { Current: true, Priority: false, Completed: false },
      remindTime: "",
    };
    setTasks(newTask);
    setTaskInput("");
  };

  return { taskInput, setTaskInput, submitTask };
};

export default useTaskMain;
