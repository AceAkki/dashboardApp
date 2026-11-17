import { View } from "react-native";

import LoadState from "@/components/ctos/LoadState";
import useFetchWeatherData from "../hooks/useFetchWeatherData";
import WeatherCard from "./WeatherCard";
import weatherStyles from "../weatherStyles";
import Corners from "@/components/ctos/Corners";

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
        <LoadState
          loading={loading}
          error={error}
          notice="Set your location to see the weather."
        />
        <Corners />
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
