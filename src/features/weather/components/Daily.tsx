import { FlatList, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import WeatherAnimation from "./WeatherAnimation";
import { formatDayShort, formatTime } from "../utils/dateFormatter";
import type { DailyProps } from "../weatherType";
import weatherStyles from "../weatherStyles";

const Daily = ({ daily, tempUnit }: DailyProps) => {
  // index 0 is today (already shown in the main card), so start from tomorrow
  const indexes = daily.time.map((_, i) => i).filter((i) => i > 0);

  return (
    <FlatList
      data={indexes}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(i) => daily.time[i]}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      renderItem={({ item: i }) => (
        <View style={weatherStyles.dailyWrap}>
          <View style={weatherStyles.dailyTop}>
            <View>
              <Text style={weatherStyles.dailyDate}>
                {formatDayShort(daily.time[i])}
              </Text>
              <Text style={weatherStyles.dailyTemp}>
                {daily.temperature_2m_max[i]}
                {tempUnit}
              </Text>
            </View>
            <WeatherAnimation code={daily.weather_code[i]} size={72} />
          </View>
          <View style={weatherStyles.dailySunWrap}>
            <View style={weatherStyles.dailySun}>
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={20}
                color={Colors.warning}
              />
              <Text style={weatherStyles.dailySunTxt}>
                {formatTime(daily.sunrise[i])}
              </Text>
            </View>
            <View style={weatherStyles.dailySun}>
              <MaterialCommunityIcons
                name="weather-sunset"
                size={20}
                color={Colors.warningSoft}
              />
              <Text style={weatherStyles.dailySunTxt}>
                {formatTime(daily.sunset[i])}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default Daily;
