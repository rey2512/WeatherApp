
import { CurrentWeather, ForecastResponse } from "../types/types";

const API_KEY = "c04177443cf52a2898384d13caf44625"; // Updated API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeatherByCity = async (city: string): Promise<CurrentWeather> => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Weather data not found (${response.status})`);
  }
  
  return await response.json();
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<CurrentWeather> => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Weather data not found (${response.status})`);
  }
  
  return await response.json();
};

export const fetchForecast = async (city: string): Promise<ForecastResponse> => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Forecast data not found (${response.status})`);
  }
  
  return await response.json();
};

// Enhanced function to fetch city suggestions
export const fetchCitySuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Use the find endpoint which is better for city autocomplete
    const response = await fetch(
      `${BASE_URL}/find?q=${query}&type=like&sort=population&cnt=7&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error("Failed to fetch city suggestions:", response.status);
      return [];
    }
    
    const data = await response.json();
    
    // Make sure we have list data
    if (!data.list || data.list.length === 0) {
      return [];
    }
    
    return data.list.map((item: any) => `${item.name}, ${item.sys.country}`);
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};
