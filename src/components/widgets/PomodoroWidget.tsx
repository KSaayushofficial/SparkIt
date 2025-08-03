"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export default function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work");
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modes = {
    work: {
      duration: 25 * 60,
      label: "Focus Time",
      color: "from-red-500 to-orange-500",
    },
    break: {
      duration: 5 * 60,
      label: "Short Break",
      color: "from-green-500 to-teal-500",
    },
    longBreak: {
      duration: 15 * 60,
      label: "Long Break",
      color: "from-blue-500 to-purple-500",
    },
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    // Play notification sound
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});

    if (mode === "work") {
      setSessions((prev) => prev + 1);
      const newMode = sessions % 4 === 3 ? "longBreak" : "break";
      setMode(newMode);
      setTimeLeft(modes[newMode].duration);
    } else {
      setMode("work");
      setTimeLeft(modes.work.duration);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode: "work" | "break" | "longBreak") => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;

  return (
    <GlassPanel className="p-6" glow>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Pomodoro Timer</h2>
        <p className="text-white/70 mb-6">{modes[mode].label}</p>

        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
              }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-white/70">
                Session {sessions + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={`bg-gradient-to-r ${modes[mode].color} p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-all duration-300"
          >
            <RotateCcw size={24} />
          </motion.button>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center gap-2">
          {Object.entries(modes).map(([key, { label }]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchMode(key as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                mode === key
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
