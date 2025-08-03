"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import TodoWidget from "@/components/widgets/TodoWidget";
import PomodoroWidget from "@/components/widgets/PomodoroWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import TimeWidget from "@/components/widgets/TimeWidget";
import QuoteWidget from "@/components/widgets/QuoteWidget";
import GlassPanel from "@/components/ui/GlassPanel";

export default function Dashboard() {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10 p-6 min-h-screen"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Productivity Hub
              </h1>
              <p className="text-white/70 mt-1">Your personal workspace</p>
            </div>
            <div className="flex items-center space-x-4">
              <TimeWidget compact />
            </div>
          </div>
        </GlassPanel>
      </motion.header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TodoWidget />
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <CalendarWidget />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-6">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PomodoroWidget />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <WeatherWidget />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <QuoteWidget />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
