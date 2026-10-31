import { useShallow } from "zustand/shallow";
import usePomodoroMain from "./hooks/usePomodoroMain";
import { usePomoStore } from "./hooks/usepomoStore";
import { PlayIcon, PauseIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import "./pomodoro.css";

const Pomodoro = () => {
  // using the pomo store - that preserves and syncs state with local storage
  const {
    endTime,
    pausedMin,
    pausedSec,
    setTimeObj,
    isActive,
    setIsActive,
    tick,
    setTick,
    resetTimeObj,
  } = usePomoStore(
    useShallow((state) => ({
      endTime: state.endTime,
      pausedMin: state.pausedMin,
      pausedSec: state.pausedSec,
      setTimeObj: state.updateTimeObj,
      isActive: state.isActive,
      setIsActive: state.updateIsActive,
      tick: state.tick,
      setTick: state.updateTick,
      resetTimeObj: state.resetTimeObj,
    })),
  );

  const { remainingMin, remainingSec, handleStartPause } = usePomodoroMain({
    timeObj: { endTime: endTime, pausedMin: pausedMin, pausedSec: pausedSec },
    setTimeObj: setTimeObj,
    isActive: isActive,
    setIsActive: setIsActive,
    tick: tick,
    setTick: setTick,
  });

  return (
    <div className="pomo-main-wrap">
      <div>
        <div className="circle">
          <div className="pomo-txt">
            <h1 className="pomo-time">{`${remainingMin}:${remainingSec.toString().padStart(2, "0")}`}</h1>
            <button
              onClick={() => handleStartPause()}
              className="pomo-btn"
              aria-description={!isActive ? "Start Pomodoro" : "Pause Pomodoro"}
            >
              {!isActive ? <PlayIcon size={32} /> : <PauseIcon size={32} />}
            </button>
            <button onClick={() => resetTimeObj()} className="pomo-btn">
              <ArrowClockwiseIcon size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
