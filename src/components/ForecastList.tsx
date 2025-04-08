
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  LucideProps,
  Sun,
  Calendar,
} from "lucide-react";
import { DailyForecast } from "../types/types";
import { formatTemperature, getWeatherIconName } from "../utils/weatherUtils";

interface ForecastListProps {
  forecasts: DailyForecast[];
  isLoading: boolean;
}

export default function ForecastList({ forecasts, isLoading }: ForecastListProps) {
  if (isLoading) {
    return <ForecastSkeleton />;
  }

  if (!forecasts || forecasts.length === 0) {
    return null;
  }

  const WeatherIcon = ({ iconCode, ...props }: { iconCode: number } & LucideProps) => {
    const iconName = getWeatherIconName(iconCode);
    
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
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2" size={18} />
          5-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {forecasts.map((forecast, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
            >
              <div className="font-medium">{forecast.day}</div>
              <WeatherIcon
                iconCode={forecast.weather.id}
                className="my-2 text-primary"
                size={32}
              />
              <div className="text-lg font-semibold">
                {formatTemperature(forecast.temp)}
              </div>
              <div className="text-xs text-muted-foreground capitalize mt-1">
                {forecast.weather.description}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ForecastSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 border rounded-lg"
            >
              <Skeleton className="h-5 w-12 mb-2" />
              <Skeleton className="h-8 w-8 rounded-full my-2" />
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
