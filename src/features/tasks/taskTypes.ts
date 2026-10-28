export interface TaskActionData {
  taskName: string;
  id: string;
  type: TasksTypes;
  remindTime: string; // ISO string, "" when unset
}

export interface TasksTypes {
  active: boolean;
  urgent: boolean;
  done: boolean;
}

export type RouteType = {
  key: "*/" | "active" | "urgent" | "done";
  title: string;
};

export type TaskActionDataSet = (task: TaskActionData) => void;

export interface TasksMainWrapperProps {
  taskData: TaskActionData[];
}

export interface TasksMainProps extends TasksMainWrapperProps {
  /** "All" shows every task, otherwise one of the TasksTypes keys */
  Type: string;
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
