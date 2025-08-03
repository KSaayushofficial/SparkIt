"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <GlassPanel className="p-4" glow>
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={16} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Calendar</h3>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateMonth("prev")}
          className="p-1 rounded hover:bg-white/10 text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </motion.button>

        <h4 className="text-sm font-medium text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateMonth("next")}
          className="p-1 rounded hover:bg-white/10 text-white transition-colors"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-center text-white/60 text-xs py-1">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-6" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`h-6 flex items-center justify-center text-xs rounded cursor-pointer transition-all duration-200 ${
                isToday(day)
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              {day}
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
