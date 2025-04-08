
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, Cloud } from "lucide-react";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ForecastList from "./ForecastList";
import RecentSearches from "./RecentSearches";
import ThemeToggle from "./ThemeToggle";
import useWeatherData from "../hooks/useWeatherData";
import useRecentSearches from "../hooks/useRecentSearches";
import { toast } from "sonner";

export default function WeatherDashboard() {
  const [city, setCity] = useState("");
  const { recentSearches, addSearch, clearSearches, removeSearch } = useRecentSearches();
  const { weatherData, dailyForecasts, isLoading, error, refetchAll } = useWeatherData(city);

  const handleSearch = (searchQuery: string) => {
    setCity(searchQuery);
  };

  const handleSelectRecentSearch = (searchQuery: string) => {
    setCity(searchQuery);
  };

  // Add to recent searches when weather data is loaded, but without showing a toast
  React.useEffect(() => {
    if (weatherData) {
      addSearch(weatherData.name, weatherData.sys.country);
      // Removed the toast.success notification here
    }
  }, [weatherData, addSearch]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info("Fetching your location...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=c04177443cf52a2898384d13caf44625`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                const locationName = `${data[0].name}, ${data[0].country}`;
                setCity(locationName);
                toast.success(`Found your location: ${locationName}`);
              } else {
                toast.error("Couldn't determine your city name");
              }
            } else {
              toast.error("Error getting location details");
            }
          } catch (error) {
            console.error("Error with reverse geocoding:", error);
            toast.error("Error determining your location");
          }
        },
        (err) => {
          toast.error(`Location error: ${err.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl transition-all duration-300">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center">
            <Cloud size={32} className="mr-2 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Weather Dashboard
            </span>
          </h1>
          <ThemeToggle />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <SearchBar onSearch={handleSearch} loading={isLoading} />
          
          <Button 
            variant="outline" 
            onClick={handleGetLocation}
            className="flex items-center"
          >
            <MapPin size={18} className="mr-2" />
            Use My Location
          </Button>
        </div>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-6 animate-fade-in">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => refetchAll()}>
              <RefreshCw size={16} className="mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {recentSearches.length > 0 && (
        <div className="mb-6 animate-fade-in">
          <RecentSearches
            searches={recentSearches}
            onSelectSearch={handleSelectRecentSearch}
            onClearSearches={clearSearches}
            onRemoveSearch={removeSearch}
          />
        </div>
      )}

      {(isLoading || weatherData) && (
        <div 
          className="space-y-8 animate-fade-in cursor-pointer active:scale-[0.99] transition-transform"
          onClick={() => {
            if (!isLoading) {
              toast.info("Refreshing weather data...");
              refetchAll();
            }
          }}
        >
          <CurrentWeather data={weatherData} isLoading={isLoading} />
          <ForecastList forecasts={dailyForecasts} isLoading={isLoading} />
        </div>
      )}

      {!isLoading && !weatherData && !error && (
        <div className="text-center py-12 bg-card rounded-lg shadow-md border border-border p-8 transition-all duration-300 hover:shadow-lg">
          <div className="mb-4 text-8xl">🌤️</div>
          <h2 className="text-2xl font-bold mb-2 text-gradient-primary">Welcome to Weather Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Search for a city to view current weather conditions and forecast
          </p>
          <Button onClick={() => handleGetLocation()} variant="default" className="bg-gradient-to-r from-blue-500 to-cyan-500">
            <MapPin size={18} className="mr-2" />
            Get Weather for My Location
          </Button>
        </div>
      )}

      <footer className="mt-12 text-center text-muted-foreground text-sm border-t border-border pt-6">
        <p>Weather data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
}
