import { useEffect } from "react";
import usePomoHelper from "../hooks/usePomoHelper";
import type { PomodoroMainProps } from "../pomodoroTypes";

const usePomodoroMain = ({
  timeObj,
  setTimeObj,
  isActive,
  setIsActive,
  tick,
  setTick,
}: PomodoroMainProps) => {
  const [startPomodoro, getRemainingTime] = usePomoHelper({
    timeObj: timeObj,
    setTimeObj: setTimeObj,
  });

  // initializes remaining time default
  let remainingMin = 25;
  let remainingSec = 0;

  // sets remaining time on active
  if (timeObj.endTime !== 0 && timeObj.endTime > Date.now() && isActive) {
    const { remainingMinutes, remainingSeconds } =
      getRemainingTime() as unknown as {
        remainingMinutes: number;
        remainingSeconds: number;
      };
    remainingMin = remainingMinutes;
    remainingSec = remainingSeconds;
  }

  // sets remaining time on pause
  if (
    (timeObj.endTime !== 0 &&
      timeObj.endTime > Date.now() &&
      timeObj.pausedMin > 0) ||
    (timeObj.pausedSec > 0 && !isActive)
  ) {
    remainingMin = timeObj.pausedMin;
    remainingSec = timeObj.pausedSec;
  }

  // resets on complete
  if (timeObj.endTime !== 0 && timeObj.endTime < Date.now()) {
    setTimeObj({ endTime: 0, pausedMin: 0, pausedSec: 0 });
    setIsActive(false);
  }

  useEffect(() => {
    if (!isActive) return;
    // if endTime is 0, start pomodoro
    if (timeObj.endTime === 0) {
      startPomodoro(25, 0, 0);
    }
    const timeInterval = setInterval(() => {
      const now = Date.now();
      if (timeObj.endTime && now >= timeObj.endTime) {
        clearInterval(timeInterval);
        setIsActive(false);
        return;
      } else {
        setTick((prevTick) => prevTick + 1);
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isActive, timeObj.endTime, tick]);

  const handleStartPause = () => {
    // if active, pause pomodoro and save remaining time as paused time
    if (isActive) {
      startPomodoro(
        parseFloat(`${remainingMin + remainingSec / 60}`),
        remainingMin,
        remainingSec,
      );
      setIsActive(false);
    } else {
      // if not active, start pomodoro with paused time if it exists
      if (timeObj.pausedMin > 0 || timeObj.pausedSec > 0) {
        let pausedNum = parseFloat(
          `${timeObj.pausedMin + timeObj.pausedSec / 60}`,
        );
        startPomodoro(pausedNum, 0, 0);
      }
      setIsActive(true);
    }
  };

  return {
    startPomodoro,
    remainingMin,
    remainingSec,
    handleStartPause,
  } as const;
};

export default usePomodoroMain;
