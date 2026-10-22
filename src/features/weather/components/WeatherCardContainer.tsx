import { ActivityIndicator, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import useFetchWeatherData from "../hooks/useFetchWeatherData";
import WeatherCard from "./WeatherCard";
import weatherStyles from "../weatherStyles";

// Drop-in for the dashboard: fetches by itself and renders WeatherCard,
// so the Bento doesn't need to know about the weather hook.
const WeatherCardContainer = () => {
  const { weatherData, aqiData, loading, error } = useFetchWeatherData();

  if (!weatherData || !aqiData) {
    return (
      <View
        style={[
          weatherStyles.weatherCard,
          { alignItems: "center", paddingVertical: 32 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <Text style={weatherStyles.centerTxt}>
            {error ?? "Set your location to see the weather."}
          </Text>
        )}
      </View>
    );
  }

  return (
    <WeatherCard
      current={weatherData.current}
      current_units={weatherData.current_units}
      aqiCurrent={aqiData.current}
      aqiCurrent_units={aqiData.current_units}
    />
  );
};

export default WeatherCardContainer;
