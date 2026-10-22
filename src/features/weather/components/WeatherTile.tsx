import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import weatherStyles from "../weatherStyles";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

// matched with String.includes on the API key, same as the web version
const weatherIcon: Record<string, IconName> = {
  humidity: "water-percent",
  wind: "weather-windy",
  pressure: "gauge",
  rain: "weather-pouring",
  snowfall: "weather-snowy",
  precipitation: "weather-fog",
  temperature: "thermometer",
};

const labelFor = (key: string) =>
  key
    .replace(/_\d+m$/, "") // wind_speed_10m -> wind_speed
    .replace(/_2m$/, "")
    .replace(/_/g, " ");

type WeatherTileProps = {
  current: number;
  current_units: string;
  icon: string;
};

const WeatherTile = ({ current, current_units, icon }: WeatherTileProps) => {
  const match = Object.keys(weatherIcon).find((key) => icon.includes(key));
  return (
    <View style={weatherStyles.tile}>
      <MaterialCommunityIcons
        name={match ? weatherIcon[match] : "weather-partly-cloudy"}
        size={32}
        color={Colors.primary}
      />
      <Text style={weatherStyles.tileTxt}>
        {current}
        {current_units}
      </Text>
      <Text style={weatherStyles.tileLabel}>{labelFor(icon)}</Text>
    </View>
  );
};

export default WeatherTile;
