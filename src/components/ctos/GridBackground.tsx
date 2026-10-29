import { StyleSheet } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";

import { Colors } from "@/constants/Colors";

const SIZE = 26;

// Faint tactical grid behind a screen. Sits under the content and never takes touches.
export default function GridBackground() {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern
          id="ctosGrid"
          width={SIZE}
          height={SIZE}
          patternUnits="userSpaceOnUse"
        >
          <Path
            d={`M ${SIZE} 0 L 0 0 L 0 ${SIZE}`}
            fill="none"
            stroke={Colors.primary}
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#ctosGrid)" />
    </Svg>
  );
}
