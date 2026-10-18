import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { motion } from "motion/react";

import { useTaskStore } from "../hooks/useTasksStore";
import type { TaskActionData } from "../taskTypes";

import "./EditTaskForm.css";

const EditTaskForm = ({ taskObject }: { taskObject: TaskActionData }) => {
  const { editTask, toggleEditMode, editRemind } = useTaskStore(
    useShallow((state) => ({
      editTask: state.editTask,
      toggleEditMode: state.toggleEditMode,
      editRemind: state.editRemind,
    })),
  );
  const [newTaskTxt, SetNewTaskTxt] = useState<string>(taskObject.taskName);
  const [newRemindDate, SetNewRemindDate] = useState<string>(
    taskObject.remindTime,
  );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="edit-task-form"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
        animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
        exit={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="edit-task-content"
      >
        <div>
          <input
            type="text"
            value={newTaskTxt}
            className="task-edit show"
            onChange={(e) => {
              SetNewTaskTxt(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            value={newRemindDate.slice(0, 16)}
            className="task-edit show"
            onChange={(e) => {
              console.log(newRemindDate, e.target.value);
              SetNewRemindDate(e.target.value);
            }}
          />
        </div>
        <div className="btn-wrap">
          <button
            onClick={() => {
              editTask({ id: taskObject.id, newTask: newTaskTxt });
              editRemind({
                id: taskObject.id,
                newTime: newRemindDate,
              });
            }}
            className="confirm-btn"
          >
            Confirm
          </button>
          <button onClick={() => toggleEditMode()} className="cancel-btn">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditTaskForm;
