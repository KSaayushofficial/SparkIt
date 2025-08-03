"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  color: string;
}

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(),
      time: "10:00 AM",
      color: "bg-purple-500",
    },
    {
      id: "2",
      title: "Project Review",
      date: new Date(Date.now() + 86400000),
      time: "2:00 PM",
      color: "bg-blue-500",
    },
  ]);

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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

  const hasEvent = (day: number) => {
    return events.some(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <GlassPanel className="p-6" glow>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Calendar</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg text-white"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg hover:bg-white/10 text-white"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <h3 className="text-lg font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg hover:bg-white/10 text-white"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-white/60 text-sm py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                isToday(day)
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                  : hasEvent(day)
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              {day}
              {hasEvent(day) && (
                <div className="absolute w-1 h-1 bg-purple-400 rounded-full mt-6" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div>
        <h4 className="text-sm font-semibold text-white/80 mb-3">
          Upcoming Events
        </h4>
        <div className="space-y-2">
          {events.slice(0, 3).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className={`w-3 h-3 rounded-full ${event.color}`} />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  {event.title}
                </div>
                <div className="text-white/60 text-xs">{event.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
