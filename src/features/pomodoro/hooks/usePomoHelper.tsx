import type { TimeProps } from "../pomodoroTypes";
const usePomoHelper = ({ timeObj, setTimeObj }: TimeProps) => {
  function startPomodoro(endMin: number, pausedMin: number, pausedSec: number) {
    console.log(endMin, pausedMin, pausedSec);
    const endTime = new Date().getTime() + endMin * 60 * 1000;
    setTimeObj({
      endTime: endTime,
      pausedMin: pausedMin,
      pausedSec: pausedSec,
    });
  }

  function getRemainingTime(): {
    remainingMinutes: number;
    remainingSeconds: number;
  } {
    const milliDiff = timeObj.endTime - new Date().getTime();
    // Total number of seconds in the difference
    const totalSeconds = Math.floor(milliDiff / 1000);
    // Total number of minutes in the difference
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingMinutes = totalMinutes % 60;
    const remainingSeconds = totalSeconds % 60;

    return {
      remainingMinutes,
      remainingSeconds,
    };
  }

  return [startPomodoro, getRemainingTime] as const;
};
export default usePomoHelper;
