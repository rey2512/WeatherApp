
import { ForecastItem, DailyForecast, WeatherCondition } from "../types/types";
import { format, parseISO } from "date-fns";

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatDate = (timestamp: number): string => {
  return format(new Date(timestamp * 1000), 'EEEE, MMM d');
};

export const formatTime = (timestamp: number, timezone: number = 0): string => {
  // Adjusting for timezone offset
  const date = new Date((timestamp + timezone) * 1000);
  return format(date, 'h:mm a');
};

export const getWeatherIconName = (conditionCode: number): string => {
  // Map OpenWeatherMap condition codes to Lucide icon names
  if (conditionCode >= 200 && conditionCode < 300) return "cloud-lightning";
  if (conditionCode >= 300 && conditionCode < 400) return "cloud-drizzle";
  if (conditionCode >= 500 && conditionCode < 600) return "cloud-rain";
  if (conditionCode >= 600 && conditionCode < 700) return "cloud-snow";
  if (conditionCode >= 700 && conditionCode < 800) return "cloud-fog";
  if (conditionCode === 800) return "sun";
  if (conditionCode > 800) return "cloud";
  
  return "cloud"; // Default
};

export const getDailyForecasts = (forecastItems: ForecastItem[]): DailyForecast[] => {
  const dailyData: { [key: string]: ForecastItem[] } = {};
  
  // Group forecast items by day
  forecastItems.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });
  
  // Process each day's data
  return Object.keys(dailyData).map(date => {
    const items = dailyData[date];
    
    // Find the item closest to noon for representing the day
    const noonItem = items.reduce((closest, item) => {
      const itemHour = new Date(item.dt * 1000).getHours();
      const closestHour = new Date(closest.dt * 1000).getHours();
      return Math.abs(itemHour - 12) < Math.abs(closestHour - 12) ? item : closest;
    }, items[0]);
    
    const parsedDate = parseISO(date);
    
    return {
      date: date,
      day: format(parsedDate, 'EEE'),
      temp: noonItem.main.temp,
      weather: noonItem.weather[0]
    };
  }).slice(0, 5); // Limit to 5 days
};

export const getBackgroundClass = (weatherCondition: string): string => {
  const lowerCondition = weatherCondition.toLowerCase();
  
  if (lowerCondition.includes('clear')) return 'bg-gradient-to-r from-blue-400 to-blue-300';
  if (lowerCondition.includes('cloud')) return 'bg-gradient-to-r from-blue-300 to-gray-300';
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'bg-gradient-to-r from-blue-500 to-blue-400';
  if (lowerCondition.includes('thunderstorm')) return 'bg-gradient-to-r from-gray-700 to-gray-600';
  if (lowerCondition.includes('snow')) return 'bg-gradient-to-r from-blue-100 to-gray-100';
  if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return 'bg-gradient-to-r from-gray-300 to-gray-200';
  
  return 'bg-gradient-to-r from-blue-400 to-blue-300'; // Default
};
