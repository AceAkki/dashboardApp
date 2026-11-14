import { useState } from "react";
import { getTaskTypes } from "../taskTypeUtils";
import { cleanNote } from "../taskTags";
import { useTagField } from "../components/TagEditor";
import type { TaskActionData, TaskActionDataSet } from "../taskTypes";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const useTaskMain = (setTasks: TaskActionDataSet) => {
  const [taskInput, setTaskInput] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const tagField = useTagField();

  const submitTask = () => {
    const name = taskInput.trim();
    if (!name) return;
    const note = cleanNote(taskNote);
    const tags = tagField.final;
    const newTask: TaskActionData = {
      id: makeId(),
      taskName: name,
      type: getTaskTypes(),
      remindTime: "",
      ...(note ? { note } : {}),
      ...(tags.length ? { tags } : {}),
    };
    setTasks(newTask);
    setTaskInput("");
    setTaskNote("");
    tagField.reset();
  };

  return {
    taskInput,
    setTaskInput,
    taskNote,
    setTaskNote,
    tagField,
    submitTask,
  };
};

export default useTaskMain;
