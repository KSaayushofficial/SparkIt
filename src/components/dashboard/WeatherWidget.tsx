"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    location: "San Francisco",
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    feelsLike: 24,
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <GlassPanel className="p-4" glow>
      <div className="flex items-center gap-2 mb-4">
        <Thermometer size={16} className="text-orange-400" />
        <h3 className="text-sm font-semibold text-white">Weather</h3>
      </div>

      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {getWeatherIcon(weather.condition)}
        </motion.div>

        <div>
          <div className="text-2xl font-bold text-white">
            {weather.temperature}°C
          </div>
          <div className="text-xs text-white/70">{weather.condition}</div>
          <div className="text-xs text-white/50">{weather.location}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-center gap-1 bg-white/5 rounded-lg p-2">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span className="text-white/70">{weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-white/5 rounded-lg p-2">
            <Wind className="w-3 h-3 text-gray-400" />
            <span className="text-white/70">{weather.windSpeed}km/h</span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
