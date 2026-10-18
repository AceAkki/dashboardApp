import { useShallow } from "zustand/shallow";
import TuneIcon from "@mui/icons-material/Tune";

// components imports
import { useTaskStore } from "../hooks/useTasksStore";

// type imports
import type { TaskType } from "../taskTypes";

// css imports
import "./Task.css";

const Task = ({ taskTxt }: TaskType) => {
  const { taskID, setTaskID } = useTaskStore(
    useShallow((state) => ({
      taskID: state.taskID,
      setTaskID: state.setTaskID,
    })),
  );

  return (
    <div className="task-wrap">
      <p>{taskTxt.taskName}</p>
      <div
        className="task-btn"
        onClick={(e) => {
          taskID === taskTxt.id ? setTaskID(null) : setTaskID(taskTxt.id);
          console.log(
            e.clientX,
            e.clientY,
            document.documentElement.clientWidth,
            e,
          );
          const root = document.documentElement;
          root.style.setProperty(
            "--optionLeft",
            `calc(${e.clientX}px - var(--options-width))`,
          );
          root.style.setProperty("--optionTop", `${e.clientY}px`);
        }}
      >
        <TuneIcon />
      </div>
    </div>
  );
};

export default Task;
