import { FlatList, Text, View } from "react-native";

import WeatherAnimation from "./WeatherAnimation";
import { formatHour, getUpcomingHourIndexes } from "../utils/dateFormatter";
import type { HourlyProps } from "../weatherType";
import weatherStyles from "../weatherStyles";

// Swiper -> horizontal FlatList
const Hourly = ({ hourly, tempUnit, currentTime }: HourlyProps) => {
  const indexes = getUpcomingHourIndexes(hourly.time, currentTime, 24);

  return (
    <FlatList
      data={indexes}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(i) => hourly.time[i]}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      renderItem={({ item: i }) => (
        <View style={weatherStyles.hourWrap}>
          <View>
            <Text style={weatherStyles.hourLabel}>{formatHour(hourly.time[i])}</Text>
            <Text style={weatherStyles.hourTemp}>
              {hourly.temperature_2m[i]}
              {tempUnit}
            </Text>
          </View>
          <WeatherAnimation code={hourly.weather_code[i]} size={48} />
        </View>
      )}
    />
  );
};

export default Hourly;
