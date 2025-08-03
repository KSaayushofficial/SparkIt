"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export default function FloatingTimer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Switch modes
      if (mode === "focus") {
        setMode("break");
        setTime(5 * 60); // 5 minute break
      } else {
        setMode("focus");
        setTime(25 * 60); // 25 minute focus
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  return (
    <GlassPanel className="p-4 w-48" glow>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Timer size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-white capitalize">
            {mode} Timer
          </span>
        </div>

        <div className="text-2xl font-bold text-white mb-4">
          {formatTime(time)}
        </div>

        <div className="flex justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className={`p-2 rounded-lg ${
              mode === "focus"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gradient-to-r from-green-500 to-teal-500"
            } text-white`}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>
      </div>
    </GlassPanel>
  );
}
