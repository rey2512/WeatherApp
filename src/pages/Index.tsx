
import React from "react";
import WeatherDashboard from "../components/WeatherDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <WeatherDashboard />
      </div>
    </div>
  );
};

export default Index;
