export interface TaskActionData {
  taskName: string;
  id: string;
  type: TasksTypes;
  remindTime: string;
}

export interface TasksTypes {
  Current: boolean;
  Priority: boolean;
  Completed: boolean;
}

export type TaskActionDataSet = (task: TaskActionData) => void;

export interface TasksMainWrapperProps {
  taskData: TaskActionData[];
}

export interface TasksMainProps extends TasksMainWrapperProps {
  Type: string;
}

export interface TaskType {
  taskTxt: TaskActionData;
}

export interface optionPopupProps {
  refer: React.RefObject<HTMLDivElement | null>;
  taskObject: TaskActionData;
}

export interface MoveBtnsProps {
  typesArr: string[];
  currentType: string;
  targetType: string;
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
