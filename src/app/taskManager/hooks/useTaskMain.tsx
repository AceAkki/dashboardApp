// react based import statements
import { useEffect, useRef } from "react";
import { useActionData } from "react-router-dom";
import type { TaskActionData, TaskActionDataSet } from "../taskTypes";

const useTaskMain = (setTasks: TaskActionDataSet) => {
  const actionData = useActionData() as TaskActionData | null;
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (actionData?.taskName) {
      setTasks(actionData);
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [actionData]);

  return inputRef;
};

export default useTaskMain;
