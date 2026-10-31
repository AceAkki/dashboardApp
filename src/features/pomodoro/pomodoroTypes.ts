export interface TimeObj {
  endTime: number;
  pausedMin: number;
  pausedSec: number;
}

export interface TimeProps {
  timeObj: TimeObj;
  setTimeObj: ({ endTime, pausedMin, pausedSec }: TimeObj) => void;
}

export interface ActiveProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TickProps {
  tick: number;
  setTick: React.Dispatch<React.SetStateAction<number>>;
}

export type PomodoroMainProps = TimeProps & ActiveProps & TickProps;
