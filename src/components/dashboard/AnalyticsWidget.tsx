"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Clock, Zap, BarChart3 } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Todo, Habit, Goal } from "./types";

interface AnalyticsWidgetProps {
  todos: Todo[];
  habits: Habit[];
  goals: Goal[];
}

export default function AnalyticsWidget({
  todos,
  habits,
  goals,
}: AnalyticsWidgetProps) {
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const totalTodos = todos.length;
  const completionRate =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const totalHabitStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);
  const avgGoalProgress =
    goals.length > 0
      ? goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length
      : 0;

  const totalTime = todos.reduce((acc, todo) => acc + (todo.timer || 0), 0);
  const todayCompleted = todos.filter(
    (t) =>
      t.completed &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      icon: Target,
      label: "Task Completion",
      value: `${Math.round(completionRate)}%`,
      color: "from-green-500 to-emerald-500",
      trend: "+12%",
    },
    {
      icon: Zap,
      label: "Habit Streaks",
      value: totalHabitStreak.toString(),
      color: "from-orange-500 to-red-500",
      trend: "+5",
    },
    {
      icon: TrendingUp,
      label: "Goal Progress",
      value: `${Math.round(avgGoalProgress)}%`,
      color: "from-blue-500 to-purple-500",
      trend: "+8%",
    },
    {
      icon: Clock,
      label: "Focus Time",
      value: `${Math.floor(totalTime / 3600)}h`,
      color: "from-cyan-500 to-blue-500",
      trend: "+2h",
    },
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <GlassPanel className="p-6 h-full flex flex-col" glow>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={18} className="text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Analytics</h3>
      </div>

      <div className="flex-1 space-y-4">
        {/* Progress Ring */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#analyticsGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - completionRate / 100)
                }`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 40 * (1 - completionRate / 100),
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="analyticsGradient"
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
                <div className="text-lg font-bold text-white">
                  {Math.round(completionRate)}%
                </div>
                <div className="text-xs text-white/70">Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
              }}
              className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <stat.icon size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-green-400">{stat.trend}</div>
                  </div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/5 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-green-400">
              {todayCompleted}
            </div>
            <div className="text-xs text-white/70">Completed Today</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-blue-400">
              {formatTime(totalTime)}
            </div>
            <div className="text-xs text-white/70">Total Focus</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
