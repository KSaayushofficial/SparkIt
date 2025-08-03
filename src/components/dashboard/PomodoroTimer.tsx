"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface PomodoroTimerProps {
  onNotification: (notification: any) => void;
}

export default function PomodoroTimer({ onNotification }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work");
  const [sessions, setSessions] = useState(0);
  const [settings, setSettings] = useState({
    work: 25,
    break: 5,
    longBreak: 15,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modes = {
    work: {
      duration: settings.work * 60,
      label: "Focus Time",
      color: "from-red-500 to-orange-500",
    },
    break: {
      duration: settings.break * 60,
      label: "Short Break",
      color: "from-green-500 to-teal-500",
    },
    longBreak: {
      duration: settings.longBreak * 60,
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
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});

    if (mode === "work") {
      setSessions((prev) => prev + 1);
      const newMode = sessions % 4 === 3 ? "longBreak" : "break";
      setMode(newMode);
      setTimeLeft(modes[newMode].duration);

      onNotification({
        title: "Work Session Complete!",
        message: `Great job! Time for a ${
          newMode === "longBreak" ? "long" : "short"
        } break.`,
        type: "success",
      });
    } else {
      setMode("work");
      setTimeLeft(modes.work.duration);

      onNotification({
        title: "Break Time Over!",
        message: "Ready to focus? Let's start another work session.",
        type: "info",
      });
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
    <GlassPanel className="p-6 h-full flex flex-col" glow>
      <div className="text-center flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {modes[mode].label}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
          >
            <Settings size={16} />
          </motion.button>
        </div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#pomodoroGradient)"
              strokeWidth="6"
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
              <linearGradient
                id="pomodoroGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-white/70">
                Session {sessions + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-4">
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={`bg-gradient-to-r ${modes[mode].color} p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center gap-1">
          {Object.entries(modes).map(([key, { label }]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchMode(key as any)}
              className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                mode === key
                  ? "bg-white/20 text-white shadow-lg"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {label.split(" ")[0]}
            </motion.button>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
