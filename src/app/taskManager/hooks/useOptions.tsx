import { nanoid } from "nanoid";

import type { MoveBtnsProps, TasksTypes } from "../taskTypes";
export default function useOptions() {
  return {
    MoveBtns,
    getCurrentType,
  };
}

function MoveBtns({
  typesArr,
  moveTask,
  taskObject,
  currentType,
}: MoveBtnsProps) {
  return typesArr.map((targetType) => {
    return (
      <li key={nanoid()}>
        <button
          onClick={() =>
            moveTask({
              id: taskObject.id,
              currentType: currentType,
              targetType: targetType,
            })
          }
        >
          {targetType}
        </button>
      </li>
    );
  });
}

function getCurrentType(object: TasksTypes): string | any {
  for (let [key, value] of Object.entries(object)) {
    if (value === true) {
      return key;
    }
  }
}
