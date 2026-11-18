import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";
import WeatherAnimation from "./WeatherAnimation";
import { getAQILevel, toSentenceCase, USAQI } from "../utils/getAQI";
import { formatFullDate } from "../utils/dateFormatter";
import type { WeatherCardProps } from "../weatherType";
import weatherStyles from "../weatherStyles";
import { fontSize } from "@/style/globalStyles";
import Panel from "@/components/ctos/Panel";
import IconButton from "@/components/ctos/IconButton";

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
    <Panel
      style={weatherStyles.weatherCard}
      title={isDashboard ? "Weather" : undefined}
      right={
        isDashboard ? (
          <IconButton
            variant="plain"
            icon="expand-outline"
            label="Open weather"
            onPress={() => router.push("/Weather")}
          />
        ) : undefined
      }
    >
      <Text style={weatherStyles.weatherDate}>
        {formatFullDate(current.time)}
      </Text>

      <View
        style={[
          weatherStyles.weatherTemp,
          !isDashboard && weatherStyles.weatherRow,
        ]}
      >
        <Text
          style={[
            weatherStyles.temp,
            isDashboard && { fontSize: fontSize.display_sml },
          ]}
        >
          {current.temperature_2m}
          {current_units.temperature_2m}
        </Text>
        <WeatherAnimation
          code={current.weather_code}
          size={135}
          isDay={current.is_day !== 0}
        />
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
    </Panel>
  );
};

export default WeatherCard;
