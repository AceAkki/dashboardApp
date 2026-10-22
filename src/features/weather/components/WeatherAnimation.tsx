import { View } from "react-native";
import LottieView from "lottie-react-native";

// Copy your existing JSON files into  src/features/weather/lottieAnime/
// (see the README in that folder). Metro needs static require paths.
/* eslint-disable @typescript-eslint/no-require-imports */
const sunny = require("../lottieAnime/Weather-sunny.json");
const foggy = require("../lottieAnime/Foggy.json");
const mist = require("../lottieAnime/Weather-mist.json");
const partlyCloudy = require("../lottieAnime/Weather-partly-cloudy.json");
const partlyShower = require("../lottieAnime/Weather-partly-shower.json");
const snow = require("../lottieAnime/Weather-snow.json");
const storm = require("../lottieAnime/Weather-storm.json");
const thunder = require("../lottieAnime/Weather-thunder.json");

const weatherRef = [
  { ids: [0, 1], file: sunny },
  { ids: [2, 3], file: partlyCloudy },
  { ids: [45, 48], file: foggy },
  { ids: [51, 53, 55], file: mist },
  { ids: [61, 63, 65], file: partlyShower },
  { ids: [80, 81, 82], file: storm },
  { ids: [95, 96, 99], file: thunder },
  { ids: [56, 57, 66, 67, 71, 73, 75, 77, 85, 86], file: snow },
];

type Props = { code: number; size?: number };

// Replaces useLottieAnime / RenderAnime. Unknown codes fall back to
// partly-cloudy instead of crashing like the web lookup did.
const WeatherAnimation = ({ code, size = 64 }: Props) => {
  const source =
    weatherRef.find((o) => o.ids.includes(code))?.file ?? partlyCloudy;
  // Fixed-size wrapper: on web the player fills its parent and ignores its own
  // width/height, so the wrapper is what actually sets the size.
  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      <LottieView
        source={source}
        autoPlay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default WeatherAnimation;
