import { useShallow } from "zustand/shallow";
import useOptions from "../hooks/useOptions";
import { useTaskStore } from "../hooks/useTasksStore";
// type imports
import type { optionPopupProps } from "../taskTypes";

// css imports
import "./OptionsPopup.css";
import { useEffect } from "react";

export default function OptionsPopup({ refer, taskObject }: optionPopupProps) {
  const { MoveBtns, getCurrentType } = useOptions();
  const { moveTask, deleteTask, toggleEditMode } = useTaskStore(
    useShallow((state) => ({
      moveTask: state.moveTask,
      deleteTask: state.deleteTask,
      toggleEditMode: state.toggleEditMode,
    })),
  );

  let typesArr = ["Current", "Priority", "Completed"];
  let currentType = getCurrentType(taskObject.type);
  let newArr = Array.from(
    new Set(typesArr.filter((type) => type !== currentType)),
  );

  useEffect(() => {
    if (refer?.current) {
      let optionWidth = refer.current.getBoundingClientRect().width;
      const root = document.documentElement;
      root.style.setProperty("--options-width", `${optionWidth}px`);
      console.log(optionWidth);
    }
  }, []);
  return (
    <div className={`options-wrap`} ref={refer}>
      <ul>
        <MoveBtns
          typesArr={newArr}
          moveTask={moveTask}
          taskObject={taskObject}
          currentType={currentType}
          targetType=""
        />
        <li>
          <button onClick={() => toggleEditMode()}> Remind Me </button>
        </li>
        <li>
          <button onClick={() => toggleEditMode()}> Edit Task </button>
        </li>
        <li>
          <button onClick={() => deleteTask(taskObject.id)}>Delete Task</button>
        </li>
      </ul>
    </div>
  );
}
