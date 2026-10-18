// component imports
import Task from "./Task";

// type imports
import type { TasksMainProps } from "../taskTypes";

// css imports
import "./TasksMain.css";

const TasksMain = ({ taskData, Type }: TasksMainProps) => {
  if (!Array.isArray(taskData)) return;
  let filterTasks = taskData.filter(
    (task) => task.type[Type as keyof typeof task.type],
  );
  return (
    <div className="tasks-main-wrap">
      <h3 className="tasks-main-title">{Type} Tasks</h3>
      <div className="tasks-wrap">
        {filterTasks.map((task) => (
          <Task key={`${task.id}`} taskTxt={task} />
        ))}
      </div>
    </div>
  );
};

export default TasksMain;
