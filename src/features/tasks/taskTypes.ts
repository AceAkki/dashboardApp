import type { taskMain, ALL_TAB } from "./taskTypeUtils";
import type { Repeat } from "./taskRepeat";

export interface TaskActionData {
  taskName: string;
  id: string;
  type: TasksTypes;
  remindTime: string; // ISO string, "" when unset
  /** optional. Repeats the reminder at the time of day set in remindTime. Never set without a remindTime. */
  repeat?: Repeat;
  /** optional, up to MAX_NOTE chars. Older saved tasks simply don't have it. */
  note?: string;
  /** optional, up to MAX_TAGS short lowercase tags (no #). Older saved tasks don't have it. */
  tags?: string[];
}

export type TaskKind = keyof typeof taskMain;
export type TaskKindArr = TaskKind[];
export type TaskTab = typeof ALL_TAB | TaskKind;
export type TasksTypes = Record<TaskKind, boolean>;

export type RouteType = {
  key: TaskTab;
  title: string;
};

export type TaskActionDataSet = (task: TaskActionData) => void;

export interface TasksMainWrapperProps {
  taskData: TaskActionData[];
}

export interface TasksMainProps extends TasksMainWrapperProps {
  /** "All" shows every task, otherwise one of the TasksTypes keys */
  Type: string;
  /** narrow the tab further: one tag, and/or a search text */
  tag?: string | null;
  query?: string;
}

export interface TaskType {
  taskTxt: TaskActionData;
}

export interface PopupPosition {
  x: number;
  y: number;
}

export interface optionPopupProps {
  taskObject: TaskActionData;
  position: PopupPosition;
  onClose: () => void;
}

export interface MoveBtnsProps {
  typesArr: string[];
  currentType: string;
  taskObject: TaskActionData;
  moveTask: ({ id, targetType, currentType }: MoveTaskProps) => void;
}

export type MoveTaskProps = {
  id: string;
  targetType: string;
  currentType: string;
};

export interface OptionsMain extends TaskType {
  currentType: string;
  targetType: string;
}
