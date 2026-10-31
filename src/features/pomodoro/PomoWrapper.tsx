import { useShallow } from "zustand/shallow";
import Pomodoro from "./Pomodoro";
import usePomodoroMain from "./hooks/usePomodoroMain";
import { usePomoStore } from "./hooks/usepomoStore";
import "./PomoWrapper.css";

const PomoWrapper = () => {
  const {
    endTime,
    pausedMin,
    pausedSec,
    setTimeObj,
    isActive,
    setIsActive,
    tick,
    setTick,
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
    })),
  );
  const { remainingMin, remainingSec } = usePomodoroMain({
    timeObj: { endTime: endTime, pausedMin: pausedMin, pausedSec: pausedSec },
    setTimeObj: setTimeObj,
    isActive: isActive,
    setIsActive: setIsActive,
    tick: tick,
    setTick: setTick,
  });
  return (
    <div className="pomo-wrapper">
      <p className="background-txt">{`${remainingMin} ${remainingSec.toString().padStart(2, "0")}`}</p>
      <Pomodoro />
    </div>
  );
};

export default PomoWrapper;
