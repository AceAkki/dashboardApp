import { useEffect } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { Colors } from "@/constants/Colors";
import BarsLoader from "./boot/BarsLoader";
import CircleCube from "./boot/CircleCube";
import GridAppText from "./boot/GridAppText";
import HexLogin from "./boot/HexLogin";
import { FPS, VB_H, VB_W } from "./boot/bootKit";

// The four boot pieces played back to back in one centred, stacked container:
// BarsLoader -> GridAppText -> HexLogin -> CircleCube (which holds at the end).
// About 5 s at speed 1. Drop it in anywhere you'd use a boot animation.
//
//   <BootSequence onDone={() => setBooted(true)} />
//   <BootSequence size={300} speed={1.5} color="#00F0FF" />
//
// onDone     called after the finale has held for `hold` seconds, or on tap
// speed      1 = the video's speed, 2 = twice as fast
// size       width of the animation in px (default 280)
// gap        seconds of pause between pieces (default 0.2)
// hold       seconds the finished circle stays up before onDone (default 0.6)
// skippable  tapping the screen calls onDone straight away (default true)
// color      line colour (default white)
// background screen colour (default your app background)

// frames in each piece, in play order
const PIECES = [38, 20, 45, 47];

type Props = {
  onDone?: () => void;
  speed?: number;
  size?: number;
  gap?: number;
  hold?: number;
  skippable?: boolean;
  color?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
};

export default function BootSequence({
  onDone,
  speed = 1,
  size = 680,
  gap = 0.2,
  hold = 0.6,
  skippable = true,
  color = "#ffffff",
  background = Colors.background,
  style,
}: Props) {
  // seconds (real time) at which each piece starts, and when everything ends
  const seconds = PIECES.map((frames) => frames / FPS / speed);
  const starts = seconds.map((_, i) =>
    seconds.slice(0, i).reduce((sum, s) => sum + s + gap, 0),
  );
  const total = starts[3] + seconds[3] + hold;

  useEffect(() => {
    if (!onDone) return;
    const timer = setTimeout(onDone, total * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const layer: ViewStyle = { position: "absolute", top: 0, left: 0 };
  const common = { size, speed, color, style: layer };

  return (
    <Pressable
      disabled={!skippable}
      onPress={onDone}
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: background,
        },
        style,
      ]}
    >
      <View style={{ width: size, height: (size * VB_H) / VB_W }}>
        <BarsLoader {...common} delay={starts[0]} />
        <GridAppText {...common} delay={starts[1]} />
        <HexLogin {...common} delay={starts[2]} />
        <CircleCube {...common} delay={starts[3]} holdLast />
      </View>
    </Pressable>
  );
}
