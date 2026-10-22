import type { AQIData, LatLng, WeatherData } from "../weatherType";

export const getWeather = async ({
  latitude,
  longitude,
}: LatLng): Promise<WeatherData | null> => {
  try {
    // timezone=auto returns times in the location's own timezone
    // (the web version hardcoded Asia/Bangkok)
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,sunrise,sunset,daylight_duration,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation,surface_pressure,pressure_msl,weather_code,rain,snowfall&timezone=auto`,
    );
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    return (await res.json()) as WeatherData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAQI = async ({
  latitude,
  longitude,
}: LatLng): Promise<AQIData | null> => {
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,us_aqi`,
    );
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    return (await res.json()) as AQIData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
