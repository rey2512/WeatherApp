
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Eye
} from "lucide-react";
import { CurrentWeather as CurrentWeatherType } from "../types/types";
import { formatTemperature, formatDate, formatTime, getWeatherIconName } from "../utils/weatherUtils";

interface CurrentWeatherProps {
  data: CurrentWeatherType | undefined;
  isLoading: boolean;
}

export default function CurrentWeather({ data, isLoading }: CurrentWeatherProps) {
  if (isLoading) {
    return <CurrentWeatherSkeleton />;
  }

  if (!data) {
    return null;
  }

  const WeatherIcon = () => {
    const iconName = getWeatherIconName(data.weather[0].id);
    const size = 64;
    const props = { size, className: "text-primary" };

    switch (iconName) {
      case "cloud":
        return <Cloud {...props} />;
      case "cloud-drizzle":
        return <CloudDrizzle {...props} />;
      case "cloud-rain":
        return <CloudRain {...props} />;
      case "cloud-lightning":
        return <CloudLightning {...props} />;
      case "cloud-snow":
        return <CloudSnow {...props} />;
      case "cloud-fog":
        return <CloudFog {...props} />;
      case "sun":
      default:
        return <Sun {...props} />;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="p-6 bg-primary/10 dark:bg-primary/5">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">
              {data.name}, {data.sys.country}
            </h2>
            <div className="text-sm text-muted-foreground">{formatDate(data.dt)}</div>
          </div>

          <div className="flex items-center">
            <WeatherIcon />
            <div className="ml-4">
              <div className="text-4xl font-bold">{formatTemperature(data.main.temp)}</div>
              <div className="text-sm capitalize">{data.weather[0].description}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-2">
          <div className="flex items-center text-muted-foreground mb-1">
            <Thermometer size={16} className="mr-1" />
            <span>Feels Like</span>
          </div>
          <div className="font-medium">{formatTemperature(data.main.feels_like)}</div>
        </div>

        <div className="flex flex-col items-center p-2">
          <div className="flex items-center text-muted-foreground mb-1">
            <Droplets size={16} className="mr-1" />
            <span>Humidity</span>
          </div>
          <div className="font-medium">{data.main.humidity}%</div>
        </div>

        <div className="flex flex-col items-center p-2">
          <div className="flex items-center text-muted-foreground mb-1">
            <Wind size={16} className="mr-1" />
            <span>Wind</span>
          </div>
          <div className="font-medium">{data.wind.speed} m/s</div>
        </div>

        <div className="flex flex-col items-center p-2">
          <div className="flex items-center text-muted-foreground mb-1">
            <Eye size={16} className="mr-1" />
            <span>Visibility</span>
          </div>
          <div className="font-medium">{(data.visibility / 1000).toFixed(1)} km</div>
        </div>
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg">
          <div className="text-muted-foreground mb-1">Sunrise</div>
          <div className="font-medium">{formatTime(data.sys.sunrise, data.timezone)}</div>
        </div>

        <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg">
          <div className="text-muted-foreground mb-1">Sunset</div>
          <div className="font-medium">{formatTime(data.sys.sunset, data.timezone)}</div>
        </div>
      </div>
    </Card>
  );
}

function CurrentWeatherSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 bg-primary/5">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="ml-4">
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center p-2">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center p-2 bg-secondary/50 rounded-lg">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}
