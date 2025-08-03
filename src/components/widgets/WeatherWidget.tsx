"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    location: "San Francisco",
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    icon: "partly-cloudy",
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case "cloudy":
        return <Cloud className="w-12 h-12 text-gray-400" />;
      case "rainy":
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <GlassPanel className="p-6" glow>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Weather</h3>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          {getWeatherIcon(weather.condition)}
        </motion.div>

        <div className="text-3xl font-bold text-white mb-2">
          {weather.temperature}°C
        </div>

        <div className="text-white/70 mb-4">{weather.condition}</div>

        <div className="text-sm text-white/60 mb-4">{weather.location}</div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2 bg-white/5 rounded-lg p-3">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-white/70">{weather.humidity}%</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white/5 rounded-lg p-3">
            <Wind className="w-4 h-4 text-gray-400" />
            <span className="text-white/70">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
