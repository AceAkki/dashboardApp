
import BootScreen from "@/components/BootScreen";
import BootAnimation from "@/components/BootAnimation";
import BootSequence from "@/components/BootSequence";


export const bootMap = {
    Linux : BootScreen,
    CTOS : BootAnimation,
    QCK : BootSequence
} as const

export const defaultBootKey: BootMapKey = Object.keys(bootMap)[0] as BootMapKey;
export type BootMapKey = keyof typeof bootMap;
  
