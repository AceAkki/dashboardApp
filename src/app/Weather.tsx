import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import WeatherCard from "@/features/weather/components/WeatherCard";
import Hourly from "@/features/weather/components/Hourly";
import Daily from "@/features/weather/components/Daily";
import WeatherTile from "@/features/weather/components/WeatherTile";
import useFetchWeatherData from "@/features/weather/hooks/useFetchWeatherData";
import weatherStyles from "@/features/weather/weatherStyles";
import type { WeatherData } from "@/features/weather/weatherType";
import CtosScreen from "@/components/ctos/CtosScreen";
import globalStyles from "@/style/globalStyles";

// keys that are shown elsewhere (card / hourly) and don't get a tile
const hiddenKeys = ["time", "interval", "temperature_2m", "weather_code"];

const Weather = () => {
  const { weatherData, aqiData, loading, error, storageTime, refetch } =
    useFetchWeatherData();

  if (!weatherData || !aqiData) {
    return (
      <CtosScreen style={globalStyles.screen} edges={["top", "bottom"]}>
        <View style={[weatherStyles.screen, weatherStyles.center]}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <>
              <Text style={weatherStyles.centerTxt}>
                {error ?? "Set your location to see the weather."}
              </Text>
              <Pressable style={weatherStyles.retryBtn} onPress={refetch}>
                <Text style={weatherStyles.retryTxt}>Try again</Text>
              </Pressable>
            </>
          )}
        </View>
      </CtosScreen>
    );
  }

  return (
    <CtosScreen style={globalStyles.screen} edges={["top", "bottom"]}>
      <ScrollView
        style={weatherStyles.screen}
        contentContainerStyle={weatherStyles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
      >
        <View>
          <Text style={weatherStyles.sectionTitle}>Weather</Text>
          <Text style={weatherStyles.sectionPara}>
            Check out the current weather and forecast for your location
          </Text>
        </View>

        <WeatherCard
          current={weatherData.current}
          current_units={weatherData.current_units}
          aqiCurrent={aqiData.current}
          aqiCurrent_units={aqiData.current_units}
        />

        <View style={weatherStyles.tileWrap}>
          {Object.keys(weatherData.current)
            .filter((key) => !hiddenKeys.includes(key))
            .map((key) => (
              <WeatherTile
                key={key}
                icon={key}
                current={
                  weatherData.current[
                    key as keyof WeatherData["current"]
                  ] as number
                }
                current_units={
                  weatherData.current_units[
                    key as keyof WeatherData["current_units"]
                  ]
                }
              />
            ))}
        </View>

        <View>
          <Text style={weatherStyles.sectionSubTitle}>Hourly Updates</Text>
          <Hourly
            hourly={weatherData.hourly}
            tempUnit={weatherData.hourly_units.temperature_2m}
            currentTime={weatherData.current.time}
          />
        </View>

        <View>
          <Text style={weatherStyles.sectionSubTitle}>Daily Updates</Text>
          <Daily
            daily={weatherData.daily}
            tempUnit={weatherData.daily_units.temperature_2m_max}
          />
        </View>

        {storageTime ? (
          <Text style={weatherStyles.expiry}>
            Expiry Time :{" "}
            {new Date(storageTime).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        ) : null}
      </ScrollView>
    </CtosScreen>
  );
};

export default Weather;
