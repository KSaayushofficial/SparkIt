"use client";

import { motion } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";

interface ProgressRingProps {
  progress: number;
  completed: number;
  total: number;
}

export default function ProgressRing({
  progress,
  completed,
  total,
}: ProgressRingProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <GlassPanel className="p-6" glow>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>

        <div className="relative w-32 h-32 mx-auto mb-4">
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
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-white/70">Complete</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{completed}</div>
            <div className="text-white/70">Completed</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {total - completed}
            </div>
            <div className="text-white/70">Remaining</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
