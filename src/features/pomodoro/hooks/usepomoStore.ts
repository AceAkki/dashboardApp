import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pomoKey } from "../../../global/storageKeys";
import type { TimeObj } from "../pomodoroTypes";

const initialState: PomoInitial = {
  endTime: 0,
  pausedMin: 0,
  pausedSec: 0,
  isActive: false,
  tick: 0,
};

interface PomoInitial extends TimeObj {
  isActive: boolean;
  tick: number;
}

interface usePomoStore extends PomoInitial {
  updateTimeObj: ({ endTime, pausedMin, pausedSec }: TimeObj) => void;
  updateIsActive: () => void;
  updateTick: () => void;
  resetTimeObj: () => void;
}

export const usePomoStore = create<usePomoStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateTimeObj: ({ endTime, pausedMin, pausedSec }) =>
        set(() => ({
          endTime: endTime,
          pausedMin: pausedMin,
          pausedSec: pausedSec,
        })),
      updateIsActive: () => set((state) => ({ isActive: !state.isActive })),
      updateTick: () => set((state) => ({ tick: state.tick + 1 })),
      resetTimeObj: () => set(() => initialState),
    }),
    { name: pomoKey }, // localStorage key)
  ),
);
