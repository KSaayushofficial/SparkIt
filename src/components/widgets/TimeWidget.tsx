"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";

interface TimeWidgetProps {
  compact?: boolean;
}

export default function TimeWidget({ compact = false }: TimeWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (compact) {
    return (
      <div className="text-right">
        <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
        <div className="text-sm text-white/70">
          {time.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    );
  }

  return (
    <GlassPanel className="p-6" glow>
      <div className="text-center">
        <motion.div
          key={time.getSeconds()}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {formatTime(time)}
        </motion.div>

        <div className="text-white/70">{formatDate(time)}</div>
      </div>
    </GlassPanel>
  );
}
