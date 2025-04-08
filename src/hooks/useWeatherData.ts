
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherByCity, fetchForecast } from "../services/weatherService";
import { CurrentWeather, ForecastResponse, DailyForecast } from "../types/types";
import { getDailyForecasts } from "../utils/weatherUtils";

export default function useWeatherData(city: string) {
  const [error, setError] = useState<string | null>(null);

  // Query for current weather
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    refetch: refetchWeather,
  } = useQuery({
    queryKey: ["currentWeather", city],
    queryFn: () => fetchWeatherByCity(city),
    enabled: !!city,
    retry: false,
    meta: {
      onError: (err: Error) => {
        setError(`Error fetching weather: ${err.message}`);
      }
    },
  });

  // Query for forecast
  const {
    data: forecastData,
    isLoading: isForecastLoading,
    refetch: refetchForecast,
  } = useQuery({
    queryKey: ["forecast", city],
    queryFn: () => fetchForecast(city),
    enabled: !!city,
    retry: false,
    meta: {
      onError: (err: Error) => {
        setError(`Error fetching forecast: ${err.message}`);
      }
    },
  });

  const isLoading = isWeatherLoading || isForecastLoading;

  // Process the forecast data to get daily forecasts
  const dailyForecasts: DailyForecast[] = forecastData
    ? getDailyForecasts(forecastData.list)
    : [];

  // Function to refetch all data
  const refetchAll = () => {
    setError(null);
    if (city) {
      refetchWeather();
      refetchForecast();
    }
  };

  return {
    weatherData,
    forecastData,
    dailyForecasts,
    isLoading,
    error,
    refetchAll,
  };
}
