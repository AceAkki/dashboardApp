import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";
import { Colors } from "@/constants/Colors";
import WeatherAnimation from "./WeatherAnimation";
import { getAQILevel, toSentenceCase, USAQI } from "../utils/getAQI";
import { formatFullDate } from "../utils/dateFormatter";
import type { WeatherCardProps } from "../weatherType";
import weatherStyles from "../weatherStyles";

const WeatherCard = ({
  current,
  current_units,
  aqiCurrent,
  aqiCurrent_units,
}: WeatherCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/";
  return (
    <View style={weatherStyles.weatherCard}>
      {isDashboard && (
        <Pressable
          style={weatherStyles.cardHead}
          onPress={() => router.push("/Weather")}
        >
          <Text style={weatherStyles.cardTitle}>Weather</Text>
          <Ionicons
            name="expand-outline"
            size={14}
            color={Colors.textSecondary}
          />
        </Pressable>
      )}

      <Text style={weatherStyles.weatherDate}>
        {formatFullDate(current.time)}
      </Text>

      <View
        style={[
          weatherStyles.weatherTemp,
          !isDashboard && weatherStyles.weatherRow,
        ]}
      >
        <Text style={weatherStyles.temp}>
          {current.temperature_2m}
          {current_units.temperature_2m}
        </Text>
        <WeatherAnimation code={current.weather_code} size={135} />
      </View>

      <View style={weatherStyles.aqiRow}>
        <Text style={weatherStyles.aqiTxt}>
          <Text style={weatherStyles.aqiBold}>AQI : </Text>
          {aqiCurrent.us_aqi} {aqiCurrent_units.us_aqi} |{" "}
          <Text style={weatherStyles.aqiBold}>
            {toSentenceCase(getAQILevel(aqiCurrent.us_aqi, USAQI))}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default WeatherCard;
